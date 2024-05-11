import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { User } from './user/user.entity';
import { PasswordReset } from './user/password-reset.entity';
import { Bike } from './user/bike.entity';
import { MaintenanceItem } from './user/maintenance-item.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/env/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 5432),
        database: configService.get('DB_DATABASE_NAME', 'fast-friends-dev'),
        username: configService.get('DB_USER', 'fast_friends_dev'),
        password: configService.get('DB_PASSWORD'),
        entities: [User, Bike, MaintenanceItem, PasswordReset],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
