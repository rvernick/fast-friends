import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';
import { StravaAuthenticationDto } from './strava-authentication';
import { AuthGuard, Public } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sync-strava')
  syncStravaUser(@Body() stravaAuthDto: StravaAuthenticationDto): Promise<User | null> {
    console.log('user/sync-strava stravaAuthDto:' + JSON.stringify(stravaAuthDto));
    return this.userService.syncStravaUser(stravaAuthDto);
  }

  @Post('v1/sync-strava')
  @Public()
  syncStravaUserV1(@Body() stravaAuthDto: StravaAuthenticationDto): Promise<User | null> {
    console.log('user/sync-strava stravaAuthDto:' + JSON.stringify(stravaAuthDto));
    return this.userService.syncStravaUserV1(stravaAuthDto);
  }

  @UseGuards(AuthGuard)
  @Post('update-push-token')
  updatePushToken(@Body("username") username: string, @Body("push_token") pushToken: string): Promise<User | null> {
    return this.userService.updatePushToken(username, pushToken);
  }

  @UseGuards(AuthGuard)
  @Get('oauth-verify-code')
  getOAuthVerifyCode(@Query('username') username: string, @Query('target') target: string): Promise<string | null> {
    console.log('user/oauth-verify-code user:'+ username, target);
    return this.userService.getOAuthVerifyCode(username, target);
  }

  @Public()
  @Post('v1/update-strava')
  stravaCallbackV1(@Body("stravaCode") stravaCode: string, @Body("verifyCode") verifyCode: string): Promise<boolean> {
    console.log('user/v1/update-strava user:' + stravaCode + " verifyCode: " + verifyCode);
    return this.userService.updateStravaV1(stravaCode, verifyCode);
  }

  @Public()
  @Get('v1/secrets')
  getSecrets(@Query('verifyCode') verifyCode: string, @Query('target') target: string): Promise<string[] | null> {
    return this.userService.getSecretsV1(verifyCode, target);
  }
}
