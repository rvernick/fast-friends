import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

export const createToken = (user: User): string => {
  if (user == null) return "";
  const now = new Date();
  const starter = user.username + now.getTime();
  console.log(starter);
  const result = bcrypt.hashSync(starter, 4);
  return result.replace(/[^a-zA-Z0-9 ]/g, "");
}

@Entity()
export class StravaVerify {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '000000',
  })
  code: string;

  @ManyToOne((type) => User, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: 'expires_on' })
  expiresOn: Date;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;
}
