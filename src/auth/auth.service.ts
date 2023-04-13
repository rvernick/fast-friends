import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findUsername(username);
    if (user?.password != pass) {
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
      throw new UnauthorizedException();
    }
    this.usersService.createUser(username, pass);
  }
}
