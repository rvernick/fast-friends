import { Logger, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Units, User, createNewUser } from './user.entity';
import { Bike  } from '../bike/bike.entity';
import { StravaAuthenticationDto } from './strava-authentication';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { PasswordReset, createToken } from './password-reset.entity';
import { ConfigService } from '@nestjs/config';
import { defaultMaintenanceItems } from '../bike/maintenance-item.entity';
import { createSixDigitCode, sendEmail } from '../utils/utils';
import { EmailVerify } from './email-verify.entity';
import { StravaVerify } from './strava-verify.entity';
import { BatchProcessService } from '../batch/batch-process.service';
import { BatchProcess } from '../batch/batch-process.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Bike)
    private bikesRepository: Repository<Bike>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(EmailVerify)
    private emailVerifyRepository: Repository<EmailVerify>,
    @InjectRepository(StravaVerify)
    private stravaVerifyRepository: Repository<StravaVerify>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(HttpService)
    private readonly httpService: HttpService,
    @Inject(BatchProcessService)
    private batchProcessService: BatchProcessService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    const result = this.usersRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }

  findUsername(username: string): Promise<User | null> {
    if (username == null) return null;
    const result = this.usersRepository.findOne({
      where: {
        username: username.toLocaleLowerCase(),
      },
    });
    this.logger.log('info', 'Searching for: ' + username.toLocaleLowerCase() + ' found: ' + result);
    return result;
  }

  async createUser(username: string, password: string): Promise<User> {
    const newUser = createNewUser(username.toLocaleLowerCase(), password);
    this.usersRepository.insert(newUser);
    return newUser;
  }

  updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    this.usersRepository.save(user);
  }

  save(user: User) {
    this.usersRepository.save(user);
  }

  updateUser(
      user: User,
      firstName: string,
      lastName: string,
      cellPhone: string,
      units: string,
      stravaCode: string,
      stravaRefreshToken: string,
      stravaAccessToken: string) {

    if (firstName != null) user.firstName = firstName;
    if (lastName != null) user.lastName = lastName;
    if (cellPhone != null) user.cellPhone = cellPhone;
    if (stravaCode != null) user.stravaCode = stravaCode;
    if (units != null) user.units = units == "km" ? Units.KM : Units.MILES;
    if (stravaRefreshToken!= null) user.stravaRefreshToken = stravaRefreshToken;
    if (stravaAccessToken!= null) user.stravaAccessToken = stravaAccessToken;
    this.usersRepository.save(user);
  }

  deleteUser(user: User) {
    this.usersRepository.softDelete(user.id);
  }

  async updatePushToken(username: string, pushToken: string): Promise<User | null> {
    const user = await this.findUsername(username);
    if (user == null) return null;
    this.logger.log ('info', 'Updated push token for user was: '+ user.pushToken);

    user.pushToken = pushToken || '';

    this.usersRepository.save(user);
    this.logger.log ('info', 'Updated push token for user'+ user.pushToken);
    return user;
  }

  async getStravaVerifyCode(username: string): Promise<string | null> {
    const tenMinutesInMilliseconds = 1000 * 60 * 10;
    const user = await this.findUsername(username);
    const stravaVerify = this.stravaVerifyRepository.create();
    stravaVerify.code = createSixDigitCode();
    stravaVerify.user = user;
    stravaVerify.expiresOn = new Date(Date.now() + tenMinutesInMilliseconds);
    this.stravaVerifyRepository.save(stravaVerify);
    return stravaVerify.code;
  }

  unlinkFromStrava(user: User) {
    user.stravaId = null;
    user.stravaCode = null;
    user.stravaAccessToken = null;
    user.stravaRefreshToken = null;
    this.usersRepository.save(user);
    for (const bike of user.bikes) {
      this.bikesRepository.save(bike);
    }
  }

  async getUserIdsWithStravaLinked(): Promise<number[]> {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder("user");
      queryBuilder.select("user.id", "id");
      queryBuilder.where("user.stravaId IS NOT NULL");
      const result = await queryBuilder.getRawMany();
      return result.map((row) => row.id);
    } catch (e) {
      console.log(e.message);
    }
    return Promise.resolve([]);
  }

  syncStravaUser(stravaAuthDto: StravaAuthenticationDto): Promise<User> {
    const userPromise = this.findUsername(stravaAuthDto.username);
    if (userPromise == null) return null;
    return userPromise
      .then((user: User) => {
        return this.syncUserToStrava(user, stravaAuthDto);
      })
      .catch((e: any) => {
        console.log(e.message);
        return null;
      });
  }

  async syncStravaUserV1(stravaAuthDto: StravaAuthenticationDto): Promise<User> {
    if (stravaAuthDto.verifyCode == null || stravaAuthDto.stravaCode == null) return null;
    const stravaVerify = await this.getAndVerifyStravaCode(stravaAuthDto.verifyCode);
    var lock: BatchProcess;
    try {
      lock = await this.batchProcessService.attemptLockOn(stravaAuthDto.stravaCode);
      if (lock) {
        return this.syncUserToStrava(stravaVerify.user, stravaAuthDto);
      }
      return stravaVerify.user;
    } catch (e) {
      this.logger.log('Error syncing user to strava:'+ e.message);
    } finally {
      if (lock) this.batchProcessService.unlock(lock);
    }
  }

  private async syncUserToStrava(user: User, stravaAuthDto: StravaAuthenticationDto): Promise<User> {
    const athlete = await this.getStravaAthlete(stravaAuthDto.stravaToken);
    user.stravaId = athlete.id ? athlete.id.toString() : null;
    user.stravaCode = stravaAuthDto.stravaCode;
    user.stravaRefreshToken = stravaAuthDto.stravaRefreshToken;
    console.log('setting stravaId: ' + user.stravaId);
    console.log('setting userWith: ' + JSON.stringify(stravaAuthDto));

    if (!user.firstName || user.firstName.length == 0) {
      user.firstName = athlete.firstname;
    }
    if (!user.lastName || user.lastName.length == 0) {
      user.lastName = athlete.lastname;
    }
    if (athlete.measurement_preference && athlete.measurement_preference == "meters") {
      user.units = Units.KM;
    }
    this.usersRepository.save(user);

    // console.log('bikes: ' + JSON.stringify(athlete.bikes));
    for (const bike of athlete.bikes) {
      const existingBike = this.findMatchingBike(bike, user.bikes);
      if (existingBike) {
        this.logger.log('Updating bike: '+ existingBike.id);
        this.syncStravaBike(existingBike, bike);
        await this.bikesRepository.save(existingBike);
        this.logger.log('bike updated: '+ existingBike.id)
      } else {
        this.logger.log('Adding bike:' + bike.name);
        var newBike = this.addStravaBike(user, bike);
        const savedBike = await this.bikesRepository.save(newBike);
        this.logger.log('New bike saved:' + savedBike.id);
      }
    }
    return user;
  }

  private findMatchingBike(bike: any, bikes: Bike[]): Bike | null {
    if (!bike || !bikes) return null;
    for (const existingBike of bikes) {
      if (existingBike.stravaId == bike.id) return existingBike;
      if (existingBike.name.length > 1 &&
          existingBike.name.toLowerCase() == bike.name.toLowerCase()) {
        return existingBike;
      }
    }
    return null;
  }

  addStravaBike(user: User, bike: any): Bike {
    const newBike = new Bike();
    this.syncStravaBike(newBike, bike);
    newBike.user = user;
    // newBike.maintenanceItems = defaultMaintenanceItems(newBike);
//    user.addBike(newBike);
//    this.bikesRepository.save(newBike);
    // this.logger.log('info', 'Adding bike:'+ JSON.stringify(newBike));
    // console.log('created and added: ' + JSON.stringify(newBike));
    return newBike;
  }

  syncStravaBike(bike: Bike, stravaBike: any) {
    bike.name = stravaBike.name;
    bike.stravaId = stravaBike.id;
    bike.type = stravaBike.type;
    bike.odometerMeters = stravaBike.distance;
  }

  private async getStravaAthlete(stravaAccessToken: string): Promise<any> {
    const parameters = {
      headers: {
        Authorization: 'Bearer '+ stravaAccessToken,
      },
    }
    const stravaCall = this.httpService.get('https://www.strava.com/api/v3/athlete', parameters);
    const { data }  = await firstValueFrom(
      stravaCall.pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

    async updateStravaV1(stravaCode: string, verifyCode: string): Promise<boolean> {
      const verify = await this.getAndVerifyStravaCode(verifyCode);
      try {
        this.updateUser(
          verify.user,
          null,
          null,
          null,
          null,
          stravaCode,
          null,
          null,
        );
        return true;
      } catch (e) {
        console.log('error updating user', e.message);
        return false;
      }
    }

  async getSecretsV1(verifyCode: string): Promise<any> {
    await this.getAndVerifyStravaCode(verifyCode);
    return {
      stravaClientId: this.configService.get('STRAVA_CLIENT_ID'),
      stravaSecret: this.configService.get('STRAVA_CLIENT_SECRET'),
    };
  }

  async getAndVerifyStravaCode(verifyCode: string): Promise<StravaVerify> {
    const verify = await this.stravaVerifyRepository.findOne({
      where: {
        code: verifyCode,
      },
    });

    const user = verify.user;
    if (verify == null || user == null || verify.expiresOn < new Date()) {
      this.logger.log('info', 'failed update user attempt:'+ verifyCode);
      throw new UnauthorizedException();
    }
    return verify;
  }
  
  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        token: token,
      },
    });
    if (passwordReset != null
      && passwordReset.expiresOn > new Date()) {
        const user = passwordReset.user;
        console.log('passwordReset', 'Resetting password for:'+ JSON.stringify(passwordReset));
        user.setRawPassword(newPassword);
        this.usersRepository.save(user);
    }
  }

  async testEmailSend(code: string): Promise<boolean> {
    if (code !== 'TEST_EMAIL_CODE') return false;
    const email = 'rvernick@yahoo.com';
    const msg = 'Your email verification code is: ' + code + '.';
    const htmlMsg = 'Your email verification code is: ' + code + '.  ';
    if (sendEmail(email, 'Pedal Assistant Password Reset', msg, htmlMsg)) {
      console.log('Test email sent successfully');
      return true;
    } else {
      console.log('Test email failed to send ');
      return false;
    }

    return true;
  }

  async verifyEmailCode(code: string): Promise<boolean> {
    const emailVerify = await this.emailVerifyRepository.findOne({
      where: {
        code: code,
      },
    });
    if (emailVerify!= null
      && emailVerify.expiresOn > new Date()) {
        const user = emailVerify.user;
        user.emailVerified = true;
        this.usersRepository.save(user);
        return true;
    }
    new Error('Invalid code');
  }

  async initiatePasswordReset(user: User, email: string): Promise<void> {
    const passwordReset = this.createPasswordReset(user, email);
    const passwordResetLink = this.createPasswordResetLink(passwordReset);
    this.logger.log('reset link: ' + passwordResetLink);
    this.sendPasswordResetEmail(email, passwordResetLink);
  }

  createPasswordReset(user: User, email: string): PasswordReset {
    const token = createToken(user);
    const now = new Date();
    const tenMinutesInMilliseconds = 10*60*1000;
    const expirationDate = new Date(now.getTime() + tenMinutesInMilliseconds);
    const passwordReset = new PasswordReset(user, token, expirationDate);
    this.passwordResetRepository.save(passwordReset);
    return passwordReset;
  }

  getClientBaseUrl(): string {
    return this.configService.get<string>('CLIENT_URL');
  };

  createPasswordResetLink(passwordReset: PasswordReset): string {
    const baseUrl = this.getClientBaseUrl();
    return baseUrl + '/new-password-on-reset?token=' + passwordReset.token;
  };

  sendPasswordResetEmail(email: string, passwordResetLink: string): void {
    // console.log('info', email + ' sending with:' + process.env.SENDGRID_API_KEY);
    const msg = 'Use the following link to reset your password: ' + passwordResetLink;
    const htmlMsg = 'Use the following link to reset your password: <a href="' + passwordResetLink + '"> Reset Password</a>';
   
    sendEmail(email, 'Pedal Assistant Password Reset', msg, htmlMsg);
  };

  async initiateEmailVerify(user: User, email: string): Promise<void> {
    const emailVerify = this.createEmailVerify(user, email);
    this.sendEmailVerifyEmail(email, emailVerify.code);
  }

  createEmailVerify(user: User, email: string): EmailVerify {
    const code = createSixDigitCode();
    const now = new Date();
    const tenMinutesInMilliseconds = 10*60*1000;
    const expirationDate = new Date(now.getTime() + tenMinutesInMilliseconds);
    const emailVerify = new EmailVerify(user, code, expirationDate);
    console.log('emailVerify', 'Creating email verify for:'+ JSON.stringify(emailVerify));
    this.emailVerifyRepository.save(emailVerify);
    return emailVerify;
  }

  sendEmailVerifyEmail(email: string, code: string): void {
    // console.log('info', email + ' sending with:' + process.env.SENDGRID_API_KEY);
    const msg = 'Your email verification code is: ' + code + '.';
    const htmlMsg = 'Your email verification code is: ' + code + '.  ';
    
    sendEmail(email, 'Pedal Assistant Verify Email', msg, htmlMsg);
  };

};
