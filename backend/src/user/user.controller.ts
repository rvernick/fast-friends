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
import { StravaUserDto } from './strava-user';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('bikes')
  getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    console.log('getting user:'+ username);
    return this.userService.getBikes(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sync-strava')
  create(@Body() stravaUserDto: StravaUserDto): Promise<User | null> {
    return this.userService.syncStravaUser(stravaUserDto);
  }


  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard)
  // @Post('update-user')
  // updateUser(@Body() updateUserDto: UpdateUserDto) {
  //   return this.authService.updateUser(updateUserDto);
  //
}