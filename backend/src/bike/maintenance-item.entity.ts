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
import { Bike } from './bike.entity';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';

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
  BAR_TAPE = "Bar Tape",
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

export const nextMaintenanceItem = async (maintenanceItem: MaintenanceItem): Promise<MaintenanceItem> => {
  const replacementMaintenanceItem = new MaintenanceItem();
  const bike = await maintenanceItem.bike;
  bike.maintenanceItems.push(replacementMaintenanceItem);
  replacementMaintenanceItem.part = maintenanceItem.part;
  replacementMaintenanceItem.type = maintenanceItem.type;
  replacementMaintenanceItem.brand = maintenanceItem.brand;
  replacementMaintenanceItem.model = maintenanceItem.model;
  replacementMaintenanceItem.link = maintenanceItem.link;
  replacementMaintenanceItem.dueDistanceMeters = bike.odometerMeters + defaultLongevity(maintenanceItem.part);
  replacementMaintenanceItem.dueDate = maintenanceItem.dueDate;
  replacementMaintenanceItem.completed = maintenanceItem.completed;
  return replacementMaintenanceItem;
}

@Entity()
export class MaintenanceItem {
  constructor() {
    this.completed = false;
  }

  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => Bike, (bike) => bike.maintenanceItems, { nullable: false })
  @JoinColumn()
  bike: Promise<Bike>;

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
  lastPerformedDistanceMeters: number;

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
