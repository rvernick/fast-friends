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
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}


  @HttpCode(HttpStatus.OK)
  @Get('bike')
  getBike(@Query('bikeid') bikeId: number, @Query('username') username: string): Promise<Bike | null> {
    console.log(bikeId + ' user/bike username: '+ username);
    if (!bikeId || isNaN(bikeId)) {
      console.log('Invalid bikeId:'+ bikeId);
      return Promise.resolve(null);
    }
    const result = this.userService.getBike(bikeId, username);
    console.log('user/bike result:'+ result);
    return result;
  }


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

  @HttpCode(HttpStatus.OK)
  @Post('add-or-update-bike')
  updateOrAddBike(@Body() bike: UpdateBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    const result = this.userService.updateOrAddBike(bike);
    console.log('user/add-or-update-bike bike done:'+ JSON.stringify(result));
    return result;
  }
  @HttpCode(HttpStatus.OK)
  @Post('delete-bike')
  deleteBike(@Body() bike: DeleteBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    return this.userService.deleteBike(bike);
  }
}