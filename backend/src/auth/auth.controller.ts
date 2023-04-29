import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Public } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';
import { ChangePasswordDto } from './change-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: LoginUserDto): Promise<{ access_token: string; }> {
    console.log('signing in: ' + signInDto.username);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto.username, createUserDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('changePassword')
  changePassword(@Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(
      changePassword.username,
      changePassword.oldPassword,
      changePassword.newPassword
      );
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('healthCheck')
  health() {
    return 'Running';
  }  

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // };
}