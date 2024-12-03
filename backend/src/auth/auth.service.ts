import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { UpdateStravaDto } from './update-strava.dto';
import { ResetPasswordDto } from './reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // need a test for when the username is nill or shouldn't be found
  async signIn(username: string, pass: string) {
    const user = await this.userService.findUsername(username);

    if (user == null || !user.comparePassword(pass)) {
      this.logger.log('info', 'sign in failed for: ' + username);
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUser(username: string): Promise<User | null> {
    return await this.userService.findUsername(username);
  }

  async createUser(username: string, pass: string) {
    const user = await this.userService.findUsername(username);
    if (user != null) {
      this.logger.log('info', 'attempted to create duplicate: ' + username);
      throw new UnauthorizedException();
    }
    this.userService.createUser(username, pass);
    this.requestVerifyEmail(username);
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
      this.logger.log('info', 'failed reset password attempt:' + email + ' ' + user);
      throw new UnauthorizedException();
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
