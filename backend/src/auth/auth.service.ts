import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { UpdateStravaDto } from './update-strava.dto';

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
  }

  async changePassword(username: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.findUsername(username);
    if (user == null || user?.password != oldPassword) {
      this.logger.log('info', 'failed change password attempt: ' + username);
      throw new UnauthorizedException();
    }
    this.logger.log('info', 'password changed for: ' + username);
    this.userService.updatePassword(user, newPassword);
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
      updateUserDto.mobile,
      null,
      null,
      null,
    );
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
      updateStravaDto.stravaCode,
      updateStravaDto.stravaRefreshToken,
      updateStravaDto.stravaAccessToken,
    );
  }
}
