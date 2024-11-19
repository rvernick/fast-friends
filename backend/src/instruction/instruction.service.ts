import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instruction } from './instruction.entity';
import { Part } from '../bike/part';
import { Action } from '../bike/action';
import { InstructionUpdater } from './instruction-updater';


@Injectable()
export class InstructionService {
  private readonly logger = new Logger(InstructionService.name);

  constructor(
    @InjectRepository(Instruction)
    private instructionRepository: Repository<Instruction>,
  ) {}

  findAll(): Promise<Instruction[]> {
    return this.instructionRepository.find();
  }

  findOne(id: number): Promise<Instruction | null> {
    const result = this.instructionRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }

  save(instruction: Instruction): Promise<Instruction> {
    return this.instructionRepository.save(instruction);
  }

  async getInstruction(partName: string, actionName: string): Promise<Instruction | null> {
    const part = (<any>Part)[partName];
    const action = (<any>Action)[actionName];
    try {
      const result = await this.instructionRepository.findOne({
        where: {
          part: part,
          action: action,
        },
      });
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  // TODO: decide if this should be through bikeRepository
  async getInstructions(partName: string): Promise<Instruction[] | null> {
    const part = (<any>Part)[partName];
    try {
      const result = await this.instructionRepository.find({
        where: {
          part: part,
        },
      });
      console.log('Instructions for'+ partName + ':'+ JSON.stringify(result));
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  async addOrUpdate(instruction: Instruction): Promise<Instruction> {
    try {
      const existingInstruction = await this.instructionRepository.findOne({
        where: {
          part: instruction.part,
          action: instruction.action,
        },
      });

      if (existingInstruction) {
        // Update existing instruction
        existingInstruction.difficulty = instruction.difficulty;
        existingInstruction.steps = instruction.steps;
        existingInstruction.tools = instruction.tools;
        existingInstruction.references = instruction.references;
        return this.instructionRepository.save(existingInstruction);
      } else {
        // Create new instruction
        return this.instructionRepository.save(instruction);
      }
    } catch (error) {
      console.error('Error adding or updating instruction: ', error);
      return null;
    }
  }

  instructionUpdater(): InstructionUpdater {
    return new InstructionUpdater(this.instructionRepository);
  }

  async synchronizeTestMaintenanceInstructions(): Promise<void> {
    this.instructionUpdater().updateTestInstructions();
  }

  async synchronizeMaintenanceInstructions(): Promise<void> {
    this.instructionUpdater().updateInstructions();
  }
  
}
