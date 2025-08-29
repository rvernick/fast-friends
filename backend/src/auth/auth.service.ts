import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { UpdateStravaDto } from './update-strava.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { BikeService } from '../bike/bike.service';
import { StravaService } from '../bike/strava.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bikeService: BikeService,
    private stravaService: StravaService,
  ) {}

  // need a test for when the username is nill or shouldn't be found
  async signIn(username: string, pass: string): Promise<{ access_token: string, user: User }> {
    const user = await this.userService.findUsername(username);

    if (user == null || !user.comparePassword(pass)) {
      this.logger.log('info', 'sign in failed for: ' + username);
      throw new UnauthorizedException();
    }
    this.getBikePhotoLinksCached(username);
    return this.createSignInResponse(user);
  }

  async signInStravaSSO(id: number, stravaId: string): Promise<{ access_token: string, user: User }> {
    const user = await this.userService.findOne(id);
    if (
      user == null
      || user.stravaId == null
      || user.stravaId == ''
      || user.stravaId != stravaId
    ) {
      this.logger.log('info', 'sign in failed for: ' + id);
      throw new UnauthorizedException();
    }

    await this.verifyStravaAccess(user);
    this.getBikePhotoLinksCached(user.username);
    return this.createSignInResponse(user);
  }

  async signInStravaVerifyCode(code: string): Promise<{ access_token: string; user: User; }> {
    const user = await this.userService.userForValidOAuthVerifyCode(code, 'strava');
    if (user == null) {
      this.logger.log('info', 'sign in failed for: ' + code);
      throw new UnauthorizedException();
    }
    console.log('info', 'sign in strava verify: ' +user.emailVerified);
    this.getBikePhotoLinksCached(user.username);
    return this.createSignInResponse(user);
  }

  async verifyStravaAccess(user: User): Promise<void> {
    const accessToken = await this.stravaService.getToken(user);
    if (accessToken == null) {
      this.logger.log('info', 'strava access failed for: ' + user.username);
      throw new UnauthorizedException();
    }
  }

  private async createSignInResponse(user: User): Promise<{ access_token: string; user: User; }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  private async getBikePhotoLinksCached(username: string) {
    this.bikeService.getBikes(username);
  }

  async getUser(username: string): Promise<User | null> {
    return await this.userService.findUsername(username);
  }

  async createUser(username: string, pass: string, email: string = '') {
    const user = await this.userService.findUsername(username);
    if (user != null) {
      this.logger.log('info', 'attempted to create duplicate: ' + username);
      throw new UnauthorizedException();
    }
    const newUser = await this.userService.createUser(username, pass);
    if (email!= '') {
      console.log('info', 'attempted to create user with email: ' + email);
      this.requestVerifyEmail(username);
    }
    return newUser;
  }

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.userService.findUsername(username);
    if (user == null || !user.comparePassword(oldPassword)) {
      this.logger.log('info', 'failed change password attempt: ' + username);
      return 'Invalid Password'
    }
    this.logger.log('info', 'password changed for: ' + username);
    this.userService.updatePassword(user, newPassword);
    return '';
  }

  async updateUser(updateUserDto: UpdateUserDto) {

    const username = updateUserDto.username;
    const user = await this.userService.findUsername(username);
    if (user == null) {
      this.logger.log('info', 'failed update user attempt:'+ username);
      throw new UnauthorizedException();
    }
    this.userService.updateUser(
      user,
      updateUserDto.firstName,
      updateUserDto.lastName,
      updateUserDto.cellPhone,
      updateUserDto.units,
      null,
      null,
      null,
    );
  }

  async deleteUser(username: string) {
    const user = await this.userService.findUsername(username);
    if (user == null) {
      this.logger.log('info', 'failed update user attempt:'+ username);
      throw new UnauthorizedException();
    }
    this.userService.deleteUser(user);
  }

  async getStravaSSOCode (): Promise<string> {
    return this.userService.getStravaSSOCode();
  }

  async updateStrava(updateStravaDto: UpdateStravaDto) {

    const username = updateStravaDto.username;
    const user = await this.userService.findUsername(username);
    if (user == null) {
      this.logger.log('info', 'failed update user attempt:'+ username);
      throw new UnauthorizedException();
    }
    this.userService.updateUser(
      user,
      null,
      null,
      null,
      null,
      updateStravaDto.stravaCode,
      null,
      null,
    );
  }

  async unlinkFromStrava(username: string) {
    const user = await this.userService.findUsername(username);
    if (user == null) {
      this.logger.log('info', 'failed update user attempt:'+ username);
      throw new UnauthorizedException();
    }
    this.userService.unlinkFromStrava(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findUsername(email.toLocaleLowerCase());
    if (user == null) {
      this.logger.log('info', 'failed reset password attempt:' + email + ' ' + user);
      throw new UnauthorizedException();
    }
    this.userService.initiatePasswordReset(user, email);
  }

  async requestVerifyEmail(email: string) {
    const user = await this.userService.findUsername(email.toLocaleLowerCase());
    if (user == null) {
      this.logger.log('info', 'failed email verify request' + email + ' ' + user);
      return;
    }
    if (user.emailVerified) {
      this.logger.log('info', 'email already verified: '+ email);
      return;
    }
    this.userService.initiateEmailVerify(user, email);
  }

  async verifyEmailCode(code: string): Promise<boolean> {
    return this.userService.verifyEmailCode(code);
  }

  async testEmailSend(code: string): Promise<boolean> {
    return this.userService.testEmailSend(code);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    this.userService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password);
  }
}
