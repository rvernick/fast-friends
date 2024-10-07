import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, createNewUser } from './user.entity';
import { Bike,  } from '../bike/bike.entity';
import { StravaAuthenticationDto } from './strava-authentication';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { PasswordReset, createToken } from './password-reset.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateBikeDto } from '../bike/update-bike.dto';
import { DeleteBikeDto } from '../bike/delete-bike.dto';
import { defaultMaintenanceItems } from '../bike/maintenance-item.entity';
import { sendEmail } from '../utils/utils';

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
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(HttpService)
    private readonly httpService: HttpService,
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

  createUser(username: string, password: string) {
    const newUser = createNewUser(username, password);
    this.usersRepository.insert(newUser);
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
      stravaCode: string,
      stravaRefreshToken: string,
      stravaAccessToken: string) {
    if (firstName!= null) user.firstName = firstName;
    if (lastName!= null) user.lastName = lastName;
    if (cellPhone!= null) user.cellPhone = cellPhone;
    if (stravaCode!= null) user.stravaCode = stravaCode;
    if (stravaRefreshToken!= null) user.stravaRefreshToken = stravaRefreshToken;
    if (stravaAccessToken!= null) user.stravaAccessToken = stravaAccessToken;
    this.usersRepository.save(user);
  }

  unlinkFromStrava(user: User) {
    user.stravaId = null;
    user.stravaCode = null;
    user.stravaAccessToken = null;
    user.stravaRefreshToken = null;
    this.usersRepository.save(user);
    for (const bike of user.bikes) {
      bike.stravaId = null;
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

  private async syncUserToStrava(user: User, stravaAuthDto: StravaAuthenticationDto): Promise<User> {
    const athlete = await this.getStravaAthlete(stravaAuthDto.stravaToken);
    user.stravaId = athlete.id;
    user.stravaCode = stravaAuthDto.stravaCode;
    user.stravaRefreshToken = stravaAuthDto.stravaRefreshToken;
    console.log('setting stravaId: ' + user.stravaId);
    console.log('setting userWith: ' + JSON.stringify(stravaAuthDto));
    this.usersRepository.save(user);

    if (user.bikes != null && user.bikes.length > 0) {
      return user;
    }
    this.logger.log('info', 'Syncing user:'+ JSON.stringify(user));
    console.log('bikes: ' + JSON.stringify(athlete.bikes));
    for (const bike of athlete.bikes) {
      var newBike = this.addStravaBike(user, bike);
      this.bikesRepository.save(newBike);
    }
    return user;
  }

  addStravaBike(user: User, bike: any): Bike {
    const newBike = new Bike();
    newBike.name = bike.name;
    newBike.stravaId = bike.id;
    newBike.type = bike.type;
    newBike.user = user;
    newBike.odometerMeters = bike.distance;
    newBike.maintenanceItems = defaultMaintenanceItems(newBike);
//    user.addBike(newBike);
//    this.bikesRepository.save(newBike);
    this.logger.log('info', 'Adding bike:'+ JSON.stringify(newBike));
    console.log('created and added: ' + JSON.stringify(newBike));
    return newBike;
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

  createPasswordResetLink(passwordReset: PasswordReset): string {
    const baseUrl = this.configService.get<string>('CLIENT_URL');
    return baseUrl + '/new-password-on-reset/?token=' + passwordReset.token;
  };

  sendPasswordResetEmail(email: string, passwordResetLink: string): void {
    console.log('info', email + ' sending with:' + process.env.SENDGRID_API_KEY);
    const msg = 'Use the following link to reset your password: ' + passwordResetLink;
    const htmlMsg = 'Use the following link to reset your password: <a href="' + passwordResetLink + '"> Reset Password</a>';
    
    sendEmail(email, 'Pedal Assistant Password Reset', msg, htmlMsg);
  };

  async updateOrAddBike(bikeDto: UpdateBikeDto): Promise<Bike> {
    try {
      const user = await this.findUsername(bikeDto.username);
      if (user == null) return null;
      var bike: Bike;
      if (bikeDto.id == 0) {
        bike = new Bike();
      } else {
        const id = bikeDto.id;
        bike = await this.bikesRepository.findOneBy({ id });
        if (bike == null) return null;
      }
      bike.name = bikeDto.name;
      bike.type = bikeDto.type;
      bike.setGroupsetBrand(bikeDto.groupsetBrand);
      bike.groupsetSpeed = bikeDto.groupsetSpeed;
      bike.isElectronic = bikeDto.isElectronic;
      bike.user = user;
      this.bikesRepository.save(bike);
    } catch (error) {
      console.error('Error updating or adding bike: ', error);
      return null;
    }
  }

  async deleteBike(bikeDto: DeleteBikeDto): Promise<Bike> {
    const user = await this.findUsername(bikeDto.username);
    if (user == null) return null;
    var bike: Bike;
    if (bikeDto.id == 0) {
      bike = new Bike();
    } else {
      const id = bikeDto.id;
      bike = await this.bikesRepository.findOneBy({ id });
      console.log('bike: '+ JSON.stringify(bike));
      if (bike == null) return null;
    }

    this.bikesRepository.softDelete(bike.id);
  }
}
