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

  @Public()
  @Post('login')
  signIn(@Body() signInDto: LoginUserDto): Promise<{ access_token: string; }> {
    console.log('signing in: ' + signInDto.username);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('user')
  getUser(@Query('username') username: string): Promise<User | null> {
    console.log('auth/user user:'+ username);
    return this.authService.getUser(username);
  }

  @Public()
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('creating user: ' + createUserDto.username);
    return this.authService.createUser(createUserDto.username, createUserDto.password, createUserDto.username);
  }

  @Post('change-password')
  changePassword(@Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(
      changePassword.username,
      changePassword.oldPassword,
      changePassword.newPassword
    );
  }

  @UseGuards(AuthGuard)
  @Post('update-user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('delete-user')
  deleteUser(@Body("username") username: string) {
    console.log('auth/delete-user: ' + username);
    return this.authService.deleteUser(username);
  }

  @UseGuards(AuthGuard)
  @Get('check-session')
  checkSession() {
    return { "status": 'logged-in' };
  }

  @Public()
  @Get('healthCheck')
  health() {
    console.log("Health check running.  Returning okay.")
    return 'Running';
  }

  @Public()
  @Get('strava-sso-code')
  getStravaSSO(): Promise<string> {
    console.log('user/create-strava-sso');
    return this.authService.getStravaSSOCode();
  }

  @Public()
  @Post('sign-in-strava-sso')
  signInStravaSSO(@Body('username') id: number, @Body('stravaId') stravaId: string): Promise<{ access_token: string; }> {
    console.log('signing in sso: ' + id + ' stravaId: ' + stravaId);
    return this.authService.signInStravaSSO(id, stravaId);
  }

  @Public()
  @Post('sign-in-strava-verify-code')
  signInStravaVerifyCode(@Body('verifyCode') code: string): Promise<{ access_token: string; user: User; }> {
    console.log('signing in strava verify: ' + code);
    return this.authService.signInStravaVerifyCode(code);
  }


  @UseGuards(AuthGuard)
  @Post('update-strava')
  stravaCallback(@Body() updateStravaDto: UpdateStravaDto) {
    console.log('auth/update-strava user:' + JSON.stringify(updateStravaDto));
    return this.authService.updateStrava(updateStravaDto);
  }

  @UseGuards(AuthGuard)
  @Post('unlink-from-strava')
  unlinkFromStrava(@Body("username") username: string) {
    console.log('auth/unlink-from-strava: ' + username);
    return this.authService.unlinkFromStrava(username);
  }

  @Public()
  @Post('request-password-reset')
  requestPasswordReset(@Body("username") username: string) {
    return this.authService.requestPasswordReset(username);
  }

  @Post('verify-email')
  requestVerifyEmail(@Body("username") username: string) {
    console.log('auth/request-verify-email: ' + username);
    return this.authService.requestVerifyEmail(username);
  }

  @Post('verify-email-code')
  verifyEmailCode(@Body("code") code: string): Promise<boolean> {
    console.log('auth/verify-email-code: ' + code);
    return this.authService.verifyEmailCode(code);
  }

  @Post('test-email-send')
  testEmailSend(@Body("code") code: string): Promise<boolean> {
    console.log('auth/test-email-send: ' + code);
    return this.authService.testEmailSend(code);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
