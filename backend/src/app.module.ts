import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { BikeModule } from './bike/bike.module';
import { User } from './user/user.entity';
import { PasswordReset } from './user/password-reset.entity';
import { Bike } from './bike/bike.entity';
import { MaintenanceItem } from './bike/maintenance-item.entity';
import { StravaModule } from './bike/strava.module';
import { BatchProcessModule } from './batch/batch-process.module';
import { BatchProcess } from './batch/batch-process.entity';
import { Notification } from './bike/notification';
import { MaintenanceHistory } from './bike/maintenance-history.entity';
import { ToolNeed } from './instruction/tool-need.entity';
import { Tool } from './instruction/tool.entity';
import { Step } from './instruction/step.entity';
import { Instruction } from './instruction/instruction.entity';
import { InstructionReference } from './instruction/instruction-reference.entity';
import { InstructionModule } from './instruction/instruction.module';
import { EmailVerify } from './user/email-verify.entity';
import { HelpRequestModule } from './help/help-request.module';
import { HelpComment, HelpCommentVote, HelpOffer, HelpRequest } from './help/help-request.entity';
import { StravaVerify } from './user/strava-verify.entity';
import { BikeDefinition } from './bike/bike-definition.entity';
import { BikeComponent } from './bike/bike-component.entity';

@Module({
  imports: [
    BatchProcessModule,
    AuthModule,
    UsersModule,
    BikeModule,
    StravaModule,
    InstructionModule,
    HelpRequestModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/env/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: +configService.get('DATABASE_PORT', 5432),
        database: configService.get('DATABASE_NAME', 'fast-friends-dev'),
        username: configService.get('DATABASE_USER', 'fast_friends_dev'),
        password: configService.get('DATABASE_PASSWORD'),
        entities: [User,
          Bike,
          MaintenanceItem,
          MaintenanceHistory,
          PasswordReset, Notification,
          BatchProcess,
          Instruction, Step, ToolNeed, Tool, InstructionReference,
          EmailVerify,
          HelpRequest, HelpComment, HelpCommentVote, HelpOffer,
          StravaVerify,
          BikeDefinition, BikeComponent,
        ],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
