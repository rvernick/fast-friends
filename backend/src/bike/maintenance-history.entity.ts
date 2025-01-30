import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { MaintenanceItem } from './maintenance-item.entity';

@Entity()
export class MaintenanceHistory {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => MaintenanceItem, { nullable: false, cascade: false })
  @JoinColumn({ name: "maintenance_item_id" })
  maintenanceItem: MaintenanceItem;

  @Column({nullable: false, name: 'distance_meters' })
  distanceMeters: number;

  @Column({nullable: false, name: 'done_date', default: '1/1/1970'})
  doneDate: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  brand: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  model: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  link: string;

  @DeleteDateColumn({nullable: true, name: 'deleted_on'  })
  deletedOn: Date;

  @CreateDateColumn({name: 'created_on'  })
  createdOn: Date;

  @UpdateDateColumn({name: 'updated_on'   })
  updatedOn: Date;
}
