import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instruction } from './instruction.entity';

@Entity()
export class Step {
  constructor() {
    this.stepNumber = 1;
    this.name = "";
    this.description = "";
    this.notes = "";
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instruction, instruction => instruction.steps, { orphanedRowAction: "delete" })
  @JoinColumn({ name: "instruction_id" })
  instruction: Instruction;


  @Column({
    default: 0,
    nullable: false,
    name: "step_number",
  })
  stepNumber: number;

  @Column({
    type: "varchar",
    nullable: false,
    default: "",
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: false,
    default: "",
  })
  description: string;

  @Column({
    type: "varchar",
    nullable: false,
    default: "",
  })
  notes: string;

  @Column({
    type: "varchar",
    nullable: false,
    default: "",
  })
  hints: string;
}