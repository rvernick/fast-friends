import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { BikeModule } from '../bike/bike.module';
import { StravaService } from '../bike/strava.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Bike } from '../bike/bike.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    BikeModule,
    TypeOrmModule.forFeature([User, Bike]),
    HttpModule.register(
        {
          timeout: 5000,
          maxRedirects: 5,
        }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5h' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    StravaService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
