import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { Bike } from './bike.entity';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { BikeService } from './bike.service';
import { MaintenanceItem } from './maintenance-item.entity';
import { UpdateMaintenanceItemDto } from './update-maintenance-item.dto';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @HttpCode(HttpStatus.OK)
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
  @Get('bikes')
  getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    console.log('bike/bikes user:'+ username);
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

  @HttpCode(HttpStatus.OK)
  @Get('maintenance-item')
  getMaintenanceItem(@Query('maintenanceid') maintenanceId: number, @Query('username') username: string): Promise<MaintenanceItem | null> {
    console.log('user/maintenance-items user:'+ maintenanceId +' username: '+ username);
    if (maintenanceId === undefined || maintenanceId === null) {
      throw Error('Maintenance id is required');
    }
    return this.bikeService.getMaintenanceItem(maintenanceId, username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update-maintenance-item')
  updateMaintenanceItem(@Body() maintenanceItem: UpdateMaintenanceItemDto): Promise<MaintenanceItem> {
    console.log('user/update-maintenance-item user:'+ maintenanceItem.username +' id: '+ maintenanceItem.id);
    return this.bikeService.updateMaintenanceItem(maintenanceItem);
  }

  @HttpCode(HttpStatus.OK)
  @Post('delete-maintenance-item')
  deleteMaintenanceItem(@Body('maintenanceid') maintenanceId: number, @Body('username') username: string): Promise<void> {
    console.log('user/delete-maintenance-items user:'+ maintenanceId +' username: '+ username);
    if (maintenanceId === undefined || maintenanceId === null) {
      throw Error('Maintenance id is required');
    }
    return this.bikeService.deleteMaintenanceItem(maintenanceId, username);
  }
}
