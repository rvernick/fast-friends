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
import { Part } from './part';

const oneThousandMilesInMeters = 1609344;
const threeThousandMilesInMeters = 4828032;

export const defaultMaintenanceItems = (bike: Bike): MaintenanceItem[] => {
  const maintenanceItems: MaintenanceItem[] = [];
  const odometerMeters = bike.odometerMeters == null ? 0 : bike.odometerMeters;
  const oneThousandMiles = odometerMeters + oneThousandMilesInMeters;
  const threeThousandMiles = odometerMeters + threeThousandMilesInMeters;
  maintenanceItems.push(createMaintenanceItem(Part.CHAIN, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.CASSETTE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.FRONT_TIRE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.REAR_TIRE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.FRONT_BRAKE_PADS, oneThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.REAR_BRAKE_PADS, oneThousandMiles));
  return maintenanceItems;
}

const createMaintenanceItem = (part: Part, distance: number): MaintenanceItem => {
  const maintenanceItem = new MaintenanceItem();
  maintenanceItem.part = part;
  maintenanceItem.dueDistanceMeters = distance;
  return maintenanceItem;
}

@Entity()
export class MaintenanceItem {
  constructor() {
    this.defaultLongevity = threeThousandMilesInMeters;
    this.autoAdjustLongevity = true;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Bike, (bike) => bike.maintenanceItems, { nullable: false })
  bike: Bike;
  
  @Column({
    type: "enum",
    enum: Part,
    default: Part.CHAIN,
    nullable: false,
  })
  part: Part;

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

  @Column({nullable: true, name: 'last_performed_distance_meters'  })
  lastPerformedDistanceMeters: number;

  @Column({nullable: true, name: 'due_distance_meters'})
  dueDistanceMeters: number;

  @Column({nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({nullable: true, default: false, name: 'was_notified'  })
  wasNotified: boolean;

  @Column({nullable: false, default: threeThousandMilesInMeters, name: 'default_longevity' })
  defaultLongevity: number;

  @Column({nullable: false, default: true, name: 'auto_adjust_longevity'  })
  autoAdjustLongevity: boolean;

  @DeleteDateColumn({nullable: true, name: 'deleted_on'  })
  deletedOn: Date;

  @CreateDateColumn({ name: 'created_on'  })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;
}
