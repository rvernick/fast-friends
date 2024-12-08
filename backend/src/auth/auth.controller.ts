import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';

import { AuthGuard, Public } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';
import { ChangePasswordDto } from './change-password.dto';
import { UpdateUserDto } from './update-user.dto';
import { UpdateStravaDto } from './update-strava.dto';
import { User } from '../user/user.entity';
import { ResetPasswordDto } from './reset-password.dto';

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
  @Get('user')
  getUser(@Query('username') username: string): Promise<User | null> {
    console.log('auth/user user:'+ username);
    return this.authService.getUser(username);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('creating user: ' + createUserDto.username);
    return this.authService.createUser(createUserDto.username, createUserDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  changePassword(@Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(
      changePassword.username,
      changePassword.oldPassword,
      changePassword.newPassword
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('update-user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('delete-user')
  deleteUser(@Body("username") username: string) {
    console.log('auth/delete-user: ' + username);
    return this.authService.deleteUser(username);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('check-session')
  checkSession() {
    return { "status": 'logged-in' };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('healthCheck')
  health() {
    console.log("Health check running.  Returning okay.")
    return 'Running';
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('update-strava')
  stravaCallback(@Body() updateStravaDto: UpdateStravaDto) {
    console.log('auth/update-strava user:' + JSON.stringify(updateStravaDto));
    return this.authService.updateStrava(updateStravaDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('unlink-from-strava')
  unlinkFromStrava(@Body("username") username: string) {
    console.log('auth/unlink-from-strava: ' + username);
    return this.authService.unlinkFromStrava(username);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('request-password-reset')
  requestPasswordReset(@Body("username") username: string) {
    return this.authService.requestPasswordReset(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  requestVerifyEmail(@Body("username") username: string) {
    console.log('auth/request-verify-email: ' + username);
    return this.authService.requestVerifyEmail(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email-code')
  verifyEmailCode(@Body("code") code: string): Promise<boolean> {
    console.log('auth/verify-email-code: ' + code);
    return this.authService.verifyEmailCode(code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('test-email-send')
  testEmailSend(@Body("code") code: string): Promise<boolean> {
    console.log('auth/test-email-send: ' + code);
    return this.authService.testEmailSend(code);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
