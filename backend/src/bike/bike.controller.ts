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

import { Bike } from './bike.entity';
import { User } from '../user/user.entity';
import { StravaAuthenticationDto } from '../user/strava-authentication';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { BikeService } from './bike.service';
import { MaintenanceItem } from './maintenance-item.entity';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @HttpCode(HttpStatus.OK)
  @Get('bike')
  getBike(@Query('bikeid') bikeId: number, @Query('username') username: string): Promise<Bike | null> {
    console.log(bikeId + ' user/bike username: '+ username);
    if (!bikeId || isNaN(bikeId)) {
      console.log('Invalid bikeId:'+ bikeId);
      return Promise.resolve(null);
    }
    const result = this.bikeService.getBike(bikeId, username);
    console.log('user/bike result:'+ result);
    return result;
  }


  @HttpCode(HttpStatus.OK)
  @Get('bikes')
  getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    console.log('user/bikes user:'+ username);
    return this.bikeService.getBikes(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('add-or-update-bike')
  updateOrAddBike(@Body() bike: UpdateBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    const result = this.bikeService.updateOrAddBike(bike);
    console.log('user/add-or-update-bike bike done:'+ JSON.stringify(result));
    return result;
  }
  @HttpCode(HttpStatus.OK)
  @Post('delete-bike')
  deleteBike(@Body() bike: DeleteBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    return this.bikeService.deleteBike(bike);
  }

  @HttpCode(HttpStatus.OK)
  @Get('maintenance-items')
  getMaintenanceItems(@Query('username') username: string): Promise<MaintenanceItem[] | null> {
    console.log('user/maintenance-items user:'+ username);
    return this.bikeService.getMaintenanceItems(username);
  }
}