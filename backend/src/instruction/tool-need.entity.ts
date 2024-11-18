import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instruction } from './instruction.entity';
import { Tool } from './tool.entity';
import { LevelOfNecessity } from './level-of-necessity';

@Entity()
export class ToolNeed {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instruction, instruction => instruction.steps, { orphanedRowAction: "delete" })
  @JoinColumn({ name: "instruction_id" })
  instruction: Instruction;

  @ManyToOne((type) => Tool, { nullable: false, eager: true, cascade: false })
  tool: Tool;
  
  @Column({
    type: "enum",
    enum: LevelOfNecessity,
    default: LevelOfNecessity.REQUIRED,
    nullable: false,
  })
  needed: LevelOfNecessity;
}