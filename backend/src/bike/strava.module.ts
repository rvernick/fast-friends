import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Bike } from './bike.entity';
import { MaintenanceItem } from './maintenance-item.entity';
import { StravaService } from './strava.service';
import { HttpModule } from '@nestjs/axios';
import { StravaController } from './strava.controller';


@Module({
  imports: [HttpModule.register(
    {
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([User, Bike, MaintenanceItem])],
  providers: [
    StravaService,
  ],
  controllers: [StravaController],
  exports: [StravaService],
})

export class StravaModule {}
