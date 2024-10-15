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

import { Bike } from './bike.entity';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { MaintenanceLogRequestDto } from './log-maintenance.dto';
import { BikeService } from './bike.service';
import { MaintenanceItem } from './maintenance-item.entity';
import { UpdateMaintenanceItemDto } from './update-maintenance-item.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('bike')
  getBike(@Query('bikeid') bikeId: number, @Query('username') username: string): Promise<Bike | null> {
    if (bikeId == null) {
      console.log('bike/bike has no bikeId: ' + username);
      throw new Error('bike/bike bikeid is required') as any;
    }
    try {
      console.log(bikeId + ' bike/bike username: '+ username);
      const result = this.bikeService.getBike(bikeId, username);
      console.log('bike/bike result:'+ result);
    return result;
    } catch (error) {
      console.error('bike/bike error:', error);
      return null;
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('bikes')
  getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    console.log('bike/bikes user:'+ username);
    return this.bikeService.getBikes(username);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('add-or-update-bike')
  updateOrAddBike(@Body() bike: UpdateBikeDto): Promise<Bike | null> {
    console.log('bike/add-or-update-bike bike:'+ JSON.stringify(bike));
    const result = this.bikeService.updateOrAddBike(bike);
    console.log('bike/add-or-update-bike bike done:'+ JSON.stringify(result));
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('delete-bike')
  deleteBike(@Body() bike: DeleteBikeDto): Promise<Bike | null> {
    console.log('bike/add-or-update-bike bike:'+ JSON.stringify(bike));
    return this.bikeService.deleteBike(bike);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('maintenance-items')
  getMaintenanceItems(@Query('username') username: string): Promise<MaintenanceItem[] | null> {
    console.log('user/maintenance-items user:'+ username);
    return this.bikeService.getMaintenanceItems(username);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('maintenance-item')
  getMaintenanceItem(@Query('maintenanceid') maintenanceId: number, @Query('username') username: string): Promise<MaintenanceItem | null> {
    console.log('user/maintenance-items user:'+ maintenanceId +' username: '+ username);
    if (maintenanceId === undefined || maintenanceId === null) {
      throw Error('Maintenance id is required');
    }
    return this.bikeService.getMaintenanceItem(maintenanceId, username);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('update-or-add-maintenance-item')
  updateMaintenanceItem(@Body() maintenanceItem: UpdateMaintenanceItemDto): Promise<MaintenanceItem> {
    console.log('bike/update-or-add-maintenance-item user:'+ maintenanceItem.username +' id: '+ maintenanceItem.id);
    return this.bikeService.updateOrAddMaintenanceItem(maintenanceItem);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('delete-maintenance-item')
  deleteMaintenanceItem(@Body('maintenanceid') maintenanceId: number, @Body('username') username: string): Promise<void> {
    console.log('bike/delete-maintenance-items user:'+ maintenanceId +' username: '+ username);
    if (maintenanceId === undefined || maintenanceId === null) {
      throw Error('Maintenance id is required');
    }
    return this.bikeService.deleteMaintenanceItem(maintenanceId, username);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('log-performed-maintenance')
  logPerformedMaintenance(@Body() maintenanceLogs: MaintenanceLogRequestDto): Promise<string> {
    console.log('log-performed-maintenance user:' + JSON.stringify(maintenanceLogs));
    return this.bikeService.logPerformedMaintenance(maintenanceLogs);
  }

}
