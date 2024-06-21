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
import { MaintenanceItem } from './maintenance-item.entity';

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

  @HttpCode(HttpStatus.OK)
  @Post('add-or-update-bike')
  updateOrAddBike(@Body() bike: UpdateBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    return this.userService.updateOrAddBike(bike);
  }
  @HttpCode(HttpStatus.OK)
  @Post('delete-bike')
  deleteBike(@Body() bike: DeleteBikeDto): Promise<Bike | null> {
    console.log('user/add-or-update-bike bike:'+ JSON.stringify(bike));
    return this.userService.deleteBike(bike);
  }

  @HttpCode(HttpStatus.OK)
  @Get('maintenance-items')
  getMaintenanceItems(@Query('username') username: string, @Query('bikeId') bikeId: number, @Query('latest') latest: boolean): Promise<MaintenanceItem[]> {
    console.log('user/maintenance-items " + bikeId: '+ bikeId);
    return this.userService.getMaintenanceItems(username, bikeId, latest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('performed-maintenance')
  performedMaintenance(@Body('maintenanceItemId') maintenanceItemId: number): Promise<MaintenanceItem | null> {
    console.log('user/performed-maintenance maintenanceItem:'+ (maintenanceItemId));
    return this.userService.performedMaintenance(maintenanceItemId);
  }
}