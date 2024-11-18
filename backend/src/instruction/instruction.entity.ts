import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Part } from '../bike/part';
import { Action } from '../bike/action';
import { LevelOfDifficulty } from './level-of-difficulty';
import { Step } from './step.entity';
import { ToolNeed } from './tool-need.entity';
import { InstructionReference } from './instruction-reference.entity';

@Entity()
@Index(["part", "action"], { unique: true })
export class Instruction {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: Part,
    default: Part.CHAIN,
    nullable: false,
  })
  part: Part;

  @Column({
    type: "enum",
    enum: Action,
    default: Action.REPLACE,
    nullable: false,
  })
  action: Action;

  @Column({
    type: "enum",
    enum: LevelOfDifficulty,
    default: LevelOfDifficulty.EASY,
    nullable: false,
  })
  difficulty: LevelOfDifficulty;

  @OneToMany((type) => Step, (step) => step.instruction, {
    eager: true,
    cascade: true,
  })
  steps: Step[];

  @OneToMany((type) => ToolNeed, (toolNeed) => toolNeed.instruction, {
    eager: true,
    cascade: true,
  })
  tools: ToolNeed[];

  @OneToMany((type) => InstructionReference, (reference) => reference.instruction, {
    eager: true,
    cascade: true,
  })
  references: InstructionReference[];

  @Column({
    type: "varchar",
    nullable: false,
    default: "",
  })
  hints: string;

  @CreateDateColumn({ name: 'created_on'  })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;
}
