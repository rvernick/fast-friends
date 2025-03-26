import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Public } from '../auth/auth.guard';
import { Instruction } from './instruction.entity';
import { InstructionService } from './instruction.service';

@Controller('instruction')
export class InstructionController {
  constructor(private instructionService: InstructionService) {}

  @Get('health')
  health(): string {
    return 'Up';
  }

  @Get('instruction')
  @Public()
  getInstruction(@Query('part') part: string, @Query('action') action: string): Promise<Instruction | null> {
    if (part == null || part == '' || action == null || action == '') {
      console.log('missing part ' + part + '  or action query parameters ' + action);
      throw new Error('part and action are required') as any;
    }
    try {
      console.log(part + ' part action: '+ action);
      const result = this.instructionService.getInstruction(part, action);
      console.log('bike/bike result:'+ result);
      return result;
    } catch (error) {
      console.error('bike/bike error:', error);
      return null;
    }
  }
  
  @Public()
  @Get('instructions')
  getInstructions(@Query('part') part: string): Promise<Instruction[] | null> {
    console.log('instruction/instructions part:'+ part);
    return this.instructionService.getInstructions(part);
  }
  
  @UseGuards(AuthGuard)
  @Post('add-instruction')
  addOrUpdateInstruction(@Body() instruction: Instruction): Promise<Instruction | null> {
    console.log('instruction/add-instruction user: '+ JSON.stringify(instruction));
    return this.instructionService.addOrUpdate(instruction);
  }
  
  // @UseGuards(AuthGuard)
  @Public()
  @Post('synchronize')
  synchronizeInstruction(@Query('secret') secret: string): void {  //@Query('secret') secret: string
    this.runSync(secret);
  }

  runSync(secret: string): void {  // TODO: replace with real synchronization logic. For now, it's just logging the secret.
    console.log('instruction/synchronize user: ');
    if (secret == null || secret == '') {
      console.log('missing secret query parameter');
      return;
    }
    if (secret === 'test' && process.env.NODE_ENV === 'development') {
      this.instructionService.synchronizeTestMaintenanceInstructions();
      return
    }
    if (secret === 'reset' && process.env.NODE_ENV === 'development') {
      this.instructionService.synchronizeMaintenanceInstructions();
      return;
    }
    if (secret ===  process.env.SYNCHRONIZE_SECRET) {
      this.instructionService.synchronizeMaintenanceInstructions();
      return;
    }
    console.log('invalid secret: ' + secret);
  }
}
