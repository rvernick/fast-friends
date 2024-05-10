import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Bike } from './bike.entity';

@Entity()
export class MaintenanceItem {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Bike, { nullable: false, cascade: false })
  bike: Bike;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  stravaId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  type: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  link: string;

  @Column()
  bikeDistance: number;

  @Column()
  dueDistance: number;

  @DeleteDateColumn({nullable: true})
  deletedOn: Date;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
