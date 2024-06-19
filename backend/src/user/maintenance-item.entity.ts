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

export enum Part {
  CHAIN = "Chain",
  CASSETTE = "Cassette",
  FRONT_TIRE = "Front Tire",
  REAR_TIRE = "Rear Tire",
  CRANKSET = "Crankset",
  FRONT_BRAKE_CABLE = "Front Brake Cable",
  REAR_BRAKE_CABLE = "Rear Brake Cable",
  FRONT_BRAKE_PADS = "Front Brake Pads",
  REAR_BRAKE_PADS = "Rear Brake Pads",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  BAR_TAPER = "Bar Tape",
  TUNE_UP = "Tune Up",
}

const defaultLongevity = (part: Part): number => {
  if (part === Part.FRONT_BRAKE_PADS || part === Part.REAR_BRAKE_PADS) {
    return oneThousandMilesInMeters;
  }
  return threeThousandMilesInMeters;
}

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

export const nextMaintenanceItem = (maintenanceItem: MaintenanceItem): MaintenanceItem => {
  const nextMaintenanceItem = new MaintenanceItem();
  const bike = maintenanceItem.bike;
  nextMaintenanceItem.part = maintenanceItem.part;
  nextMaintenanceItem.type = maintenanceItem.type;
  nextMaintenanceItem.brand = maintenanceItem.brand;
  nextMaintenanceItem.model = maintenanceItem.model;
  nextMaintenanceItem.link = maintenanceItem.link;
  nextMaintenanceItem.dueDistanceMeters = bike.odometerMeters + defaultLongevity(maintenanceItem.part);
  nextMaintenanceItem.dueDate = maintenanceItem.dueDate;
  nextMaintenanceItem.completed = maintenanceItem.completed;
  nextMaintenanceItem.bike = bike;
  return nextMaintenanceItem;
}

@Entity()
export class MaintenanceItem {
  constructor() {
    this.completed = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Bike, { nullable: false, cascade: false })
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

  @Column({nullable: true})
  dueDistanceMeters: number;

  @Column({nullable: true})
  dueDate: Date;

  @Column({default: false})
  completed: boolean;

  @DeleteDateColumn({nullable: true})
  deletedOn: Date;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
