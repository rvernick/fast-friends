import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import * as bcrypt from 'bcrypt';

export const createNewUser = (username: string, password: string) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User(username, hashedPassword);
  return newUser;
};

@Entity()
export class User {
  constructor(username: string, pass: string) {
    this.username = username;
    this.password = pass;
  }

  comparePassword(candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  cellPhone: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  stravaCode: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  stravaRefreshToken: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  stravaAccessToken: string;


  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
