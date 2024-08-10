import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Bike } from '../bike/bike.entity';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';
import { MaintenanceItem } from './maintenance-item.entity';
import { StravaService } from './strava.service';
import { UserService } from '../user/user.service';
import { PasswordReset } from '../user/password-reset.entity';
import { Notification } from './notification';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Bike, MaintenanceItem, PasswordReset, Notification])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BikeService,
    UserService,
    StravaService,
  ],
  controllers: [BikeController],
  exports: [BikeService],
})

export class BikeModule {}