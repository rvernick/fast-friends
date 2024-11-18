import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { Instruction } from './instruction.entity';
import { InstructionReference } from './instruction-reference.entity';
import { Step } from './step.entity';
import { ToolNeed } from './tool-need.entity';
import { Tool } from './tool.entity';
import { InstructionService } from './instruction.service';
import { InstructionController } from './instruction.controller';
import { InstructionUpdater } from './instruction-updater';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Instruction, InstructionReference, Step, ToolNeed, Tool, InstructionUpdater])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    InstructionService,
  ],
  controllers: [InstructionController],
  exports: [InstructionService],
})

export class InstructionModule {}
