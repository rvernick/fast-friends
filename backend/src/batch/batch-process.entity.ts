import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  VersionColumn
} from 'typeorm';

@Entity()
export class BatchProcess {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  lockedKey: string;

  @Column({nullable: true})
  lockedOn: Date;

  @Column({nullable: true})
  lastRan: Date;

  @VersionColumn()
  version: number;
  
  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

}
