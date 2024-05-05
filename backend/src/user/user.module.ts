import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Bike } from './bike.entity';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { UserController } from './user.controller';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Bike])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UserService
  ],
  controllers: [UserController],
  exports: [UserService],
})

export class UsersModule {}
