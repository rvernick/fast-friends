import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { S3Media } from './aws-media.entity';
import { S3MediaService } from './aws-media.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([
    S3Media,
    ])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    S3MediaService,
  ],
  controllers: [],
  exports: [S3MediaService],
})

export class S3Module {}
