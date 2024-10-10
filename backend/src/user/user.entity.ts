import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import * as bcrypt from 'bcrypt';
import { Bike } from '../bike/bike.entity';
import { createHash } from 'crypto';

export const createNewUser = (username: string, password: string) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User(username, hashedPassword);
  return newUser;
};

const key = process.env.COLUMN_ENCRYPTION_KEY;

@Entity()
export class User {
  constructor(username: string, pass: string) {
    if (username != null && username.length > 0) {
      this.username = username.toLowerCase();
    } else {
      this.username = username;
    }
    this.password = pass;
  }

  comparePassword(candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  setRawPassword(rawPassword: string) {
    this.password = bcrypt.hashSync(rawPassword, 10);
  }

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
    transformer: new EncryptionTransformer({
      key: key,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  stravaCode: string;

  @Column({
    type: 'varchar',
    nullable: true,
    transformer: new EncryptionTransformer({
      key: key,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  stravaId: string;
  
  @Column({
    type: 'varchar',
    nullable: true,
    transformer: new EncryptionTransformer({
      key: key,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  stravaRefreshToken: string;

  @Column({
    type: 'varchar',
    nullable: true,
    transformer: new EncryptionTransformer({
      key: key,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  stravaAccessToken: string;

  @OneToMany((type) => Bike, (bike) => bike.user, {
    eager: true,
    cascade: true,
  })
  bikes: Bike[];

  @DeleteDateColumn()
  deletedOn: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  addBike(bike: Bike) {
    bike.user = this;
    if (this.bikes === undefined) {
      this.bikes = [];
    }
    this.bikes.push(bike);
  }

}
