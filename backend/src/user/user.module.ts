import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Bike } from '../bike/bike.entity';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { UserController } from './user.controller';
import { PasswordReset } from './password-reset.entity';
import { EmailVerify } from './email-verify.entity';
import { StravaVerify } from './strava-verify.entity';
import { BatchProcess } from '../batch/batch-process.entity';
import { BatchProcessService } from '../batch/batch-process.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([
    User, Bike, PasswordReset, EmailVerify,
    StravaVerify,
    BatchProcess])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UserService,
    BatchProcessService
  ],
  controllers: [UserController],
  exports: [UserService],
})

export class UsersModule {}
