import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { BatchProcessService } from '../batch/batch-process.service';
import { BatchProcess } from './batch-process.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ BatchProcess ])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BatchProcessService,
  ],
  controllers: [],
  exports: [BatchProcessService],
})

export class BatchProcessModule {}
