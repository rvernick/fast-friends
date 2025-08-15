import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Bike } from './bike.entity';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { MaintenanceLogRequestDto } from './log-maintenance.dto';
import { BikeService } from './bike.service';
import { MaintenanceItem } from './maintenance-item.entity';
import { UpdateMaintenanceItemDto } from './update-maintenance-item.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MaintenanceHistorySummary } from './maintenance-history-summary';
import { MaintenanceHistory } from './maintenance-history.entity';
import { UpdateMaintenanceHistoryItemDto } from './update-maintenance-history-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @UseGuards(AuthGuard)
  @Get('bike')
  getBike(@Query('bikeid') bikeId: number, @Query('username') username: string): Promise<Bike | null> {
    try {
      if (bikeId == null) {
        console.log('bike/bike has no bikeId: ' + username);
        return null;
      }
      console.log(bikeId + ' bike/bike username: '+ username);
      const result = this.bikeService.getBike(bikeId, username);
      console.log('bike/bike result: '+ result);
      return result;
    } catch (error) {
      console.error('bike/bike error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Get('bikes')
  async getBikes(@Query('username') username: string): Promise<Bike[] | null> {
    try {
      console.log('bike/bikes user:'+ username);
      return await this.bikeService.getBikes(username);
    } catch (error) {
      console.log('bike/bikes error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Post('add-or-update-bike')
  updateOrAddBike(@Body() bike: UpdateBikeDto): Promise<Bike | null> {
    try {
      console.log('bike/add-or-update-bike bike:'+ JSON.stringify(bike));
      const result = this.bikeService.updateOrAddBike(bike);
      console.log('bike/add-or-update-bike bike done:'+ JSON.stringify(result));
      return result;
    } catch (error) {
      console.log('bike/add-or-update-bike error:', error);
      return null;
    }
  }

  @Post('upload-bike-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile('file') file: Express.Multer.File, @Body('bikeid') bikeId: string) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }
    console.log('bike/upload-photo');
    // console.log('bike/upload-photo bikeId:'+ bikeId);
    // console.log('bike/upload-photo file:'+ file);
    // console.log('bike/upload-photo file:'+ file.size);
    // console.log('bike/upload-photo file:'+ file.originalname);
    this.bikeService.updateBikePhoto(bikeId, file);
  }

  @UseGuards(AuthGuard)
  @Post('delete-bike')
  deleteBike(@Body() bike: DeleteBikeDto): Promise<Bike | null> {
    try {
      console.log('bike/add-or-update-bike bike:'+ JSON.stringify(bike));
      return this.bikeService.deleteBike(bike);
    } catch (error) {
      console.log('bike/add-or-update-bike error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Get('maintenance-items')
  getMaintenanceItems(@Query('username') username: string): Promise<MaintenanceItem[] | null> {
    try {
      console.log('user/maintenance-items user:'+ username);
      return this.bikeService.getMaintenanceItems(username);
    } catch (error) {
      console.log('user/maintenance-items error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Get('maintenance-item')
  getMaintenanceItem(@Query('maintenanceid') maintenanceId: number, @Query('username') username: string): Promise<MaintenanceItem | null> {
    try {
      console.log('user/maintenance-items user:'+ maintenanceId +' username: '+ username);
      if (maintenanceId === undefined || maintenanceId === null) {
        throw Error('Maintenance id is required');
      }
      return this.bikeService.getMaintenanceItem(maintenanceId, username);
    } catch (error) {
      console.log('user/maintenance-items error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Post('update-or-add-maintenance-item')
  updateMaintenanceItem(@Body() maintenanceItem: UpdateMaintenanceItemDto): Promise<MaintenanceItem> {
    try {
      console.log('bike/update-or-add-maintenance-item user:'+ maintenanceItem.username +' id: '+ maintenanceItem.id);
      return this.bikeService.updateOrAddMaintenanceItem(maintenanceItem);
    } catch (error) {
      console.log('bike/update-or-add-maintenance-item error:', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('delete-maintenance-item')
  deleteMaintenanceItem(@Body('maintenanceid') maintenanceId: number, @Body('username') username: string): Promise<boolean> {
    try {
      console.log('bike/delete-maintenance-items user:'+ maintenanceId +' username: '+ username);
      if (maintenanceId === undefined || maintenanceId === null) {
        throw Error('Maintenance id is required');
      }
      return this.bikeService.deleteMaintenanceItem(maintenanceId, username);
    } catch (error) {
      console.log('bike/delete-maintenance-items error:', error);
      return Promise.resolve(false);
    }
  }

  @UseGuards(AuthGuard)
  @Post('log-performed-maintenance')
  logPerformedMaintenance(@Body() maintenanceLogs: MaintenanceLogRequestDto): Promise<string> {
    try {
      console.log('log-performed-maintenance user:' + JSON.stringify(maintenanceLogs));
      return this.bikeService.logPerformedMaintenance(maintenanceLogs);
    } catch (error) {
      console.log('log-performed-maintenance error:', error);
      return error.message;
    }
  }

  @UseGuards(AuthGuard)
  @Get('maintenance-history')
  getMaintenanceHistory(@Query('username') username: string): Promise<MaintenanceHistorySummary[]> {
    try {
      console.log('bike/maintenance-history user:'+ username);
      return this.bikeService.getMaintenanceHistory(username);
    } catch (error) {
      console.log('bike/maintenance-history error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Get('maintenance-history-item')
  getMaintenanceHistoryItem(@Query('maintenance_history_id') maintenanceHistoryId: number, @Query('username') username: string): Promise<MaintenanceHistorySummary | null> {
    try {
      console.log('bike/maintenance-history-item user:'+ maintenanceHistoryId +' username: '+ username);
      if (maintenanceHistoryId === undefined || maintenanceHistoryId === null) {
        throw Error('Maintenance id is required');
      }
      return this.bikeService.getMaintenanceHistoryItem(maintenanceHistoryId, username);
    } catch (error) {
      console.log('bike/maintenance-history-item error:', error);
      return null;
    }
  }

  // update-or-add-maintenance-history-item
  @UseGuards(AuthGuard)
  @Post('update-or-add-maintenance-history-item')
  updateMaintenanceHistoryItem(@Body() maintenanceHistoryItem: UpdateMaintenanceHistoryItemDto): Promise<MaintenanceHistory> {
    try {
      console.log('bike/update-or-add-maintenance-item user:'+ maintenanceHistoryItem.username +' id: '+ maintenanceHistoryItem.id);
      return this.bikeService.updateOrAddMaintenanceHistoryItem(maintenanceHistoryItem);
    } catch (error) {
      console.log('bike/update-or-add-maintenance-item error:', error);
      return Promise.resolve(null) as any;
    }
  }

  @UseGuards(AuthGuard)
  @Post('delete-maintenance-history-item')
  deleteMaintenanceHistoryItem(@Body('maintenance_history_id') maintenanceHistoryId: number, @Body('username') username: string): Promise<boolean> {
    try {
      console.log('bike/delete-maintenance-history-item:'+ maintenanceHistoryId +' username: '+ username);
      if (maintenanceHistoryId === undefined || maintenanceHistoryId === null) {
        throw Error('Maintenance History id is required');
      }
      return this.bikeService.deleteMaintenanceHistoryItem(maintenanceHistoryId, username);
    } catch (error) {
      console.log('bike/delete-maintenance-history-item error:', error);
      return Promise.resolve(false);
    }
  }
}
