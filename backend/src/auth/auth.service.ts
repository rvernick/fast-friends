import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // need a test for when the username is nill or shouldn't be found
  async signIn(username: string, pass: string) {
    const user = await this.usersService.findUsername(username);
    if (user == null || user?.password != pass) {
      this.logger.log('info', 'sign in failed for: ' + username);
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createUser(username: string, pass: string) {
    const user = await this.usersService.findUsername(username);
    if (user != null) {
      this.logger.log('info', 'attempted to create duplicate: ' + username);
      throw new UnauthorizedException();
    }
    this.usersService.createUser(username, pass);
  }

  async changePassword(username: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findUsername(username);
    if (user == null || user?.password != oldPassword) {
      this.logger.log('info', 'failed change password attempt: ' + username);
      throw new UnauthorizedException();
    }
    this.logger.log('info', 'password changed for: ' + username);
    this.usersService.updatePassword(user, newPassword);
  }
}
