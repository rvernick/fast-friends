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
import { BatchProcess } from '../batch/batch-process.entity';
import { BatchProcessService } from '../batch/batch-process.service';
import { MaintenanceHistory } from './maintenance-history.entity';
import { EmailVerify } from '../user/email-verify.entity';
import { StravaVerify } from '../user/strava-verify.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([
    User, Bike, MaintenanceItem, MaintenanceHistory,
    PasswordReset, Notification, BatchProcess, EmailVerify,
    StravaVerify])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BikeService,
    BatchProcessService,
    UserService,
    StravaService,
  ],
  controllers: [BikeController],
  exports: [BikeService],
})

export class BikeModule {}
