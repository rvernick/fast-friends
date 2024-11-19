import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instruction } from './instruction.entity';

@Entity()
export class InstructionReference {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instruction, instruction => instruction.steps)
  @JoinColumn({ name: "instruction_id" })
  instruction: Instruction;

  @Column({
    type: "varchar",
    nullable: false,
  })
  title: string;

  @Column({
    type: "varchar",
    nullable: false,
    default: "https://www.sheldonbrown.com/",
  })
  link: string;
}
