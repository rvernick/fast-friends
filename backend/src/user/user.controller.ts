import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';
import { StravaAuthenticationDto } from './strava-authentication';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sync-strava')
  create(@Body() stravaAuthDto: StravaAuthenticationDto): Promise<User | null> {
    console.log('user/sync-strava stravaAuthDto:' + JSON.stringify(stravaAuthDto));
    return this.userService.syncStravaUser(stravaAuthDto);
  }

  @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post('update-push-token')
    updatePushToken(@Body("username") username: string, @Body("push_token") pushToken: string): Promise<User | null> {
      return this.userService.updatePushToken(username, pushToken);
    }
  
}