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

import { UserService } from './user.service';
import { Bike } from './bike.entity';
import { User } from './user.entity';
import { StravaAuthenticationDto } from './strava-authentication';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('bikes')
  getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    console.log('user/bikes user:'+ username);
    return this.userService.getBikes(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sync-strava')
  create(@Body() stravaAuthDto: StravaAuthenticationDto): Promise<User | null> {
    console.log('user/sync-strava stravaAuthDto:' + JSON.stringify(stravaAuthDto));
    return this.userService.syncStravaUser(stravaAuthDto);
  }
}