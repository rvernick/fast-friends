import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';

@Entity()
export class User {
  constructor(username: string, pass: string) {
    this.username = username;
    this.password = pass;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  /*
      transformer: new EncryptionTransformer({
      key: Buffer.from(
        't5blWVOiY2l10dqeTiUNgteRNPsB+Dk7Tqe8q9sANc0SDIQ/iP8u3tLZjYFILo24',
        'base64',
      ).toString(),
      algorithm: 'aes-256-gcm',
      ivLength: 16,
    }),
*/
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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
