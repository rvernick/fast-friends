import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MaintenanceItem } from './maintenance-item.entity';
import { GroupsetBrand } from './enums';
import { BikeDefinition, BikeDefinitionSummary } from './bike-definition.entity';

@Entity()
export class Bike {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { nullable: false, cascade: false })
  user: User;

  @OneToMany((type) => MaintenanceItem, (maintenanceItem) => maintenanceItem.bike, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  maintenanceItems: MaintenanceItem[];

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

  @Column({
    type: 'varchar',
    nullable: true,
  })
  year: string;

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
  line: string;

  @ManyToOne((type) => BikeDefinition, { nullable: true, cascade: false, eager: false })
  @JoinColumn({ name: "bike_definition_id" })
  bikeDefinition: BikeDefinition;

  bikeDefinitionSummary: BikeDefinitionSummary | null;

  @Column({
    type: "enum",
    enum: GroupsetBrand,
    default: GroupsetBrand.SHIMANO,
    nullable: true,
  })
  groupsetBrand: GroupsetBrand;

  @Column({default: false})
  isElectronic: boolean;

  @Column({nullable: true})
  groupsetSpeed: number;

  @Column({
    default: 0,
    nullable: false,
  })
  odometerMeters: number;

  @Column({
    type: 'varchar',
    name: 'photo_url',
    nullable: true})
  photoUrl: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    name: 'is_retired'
  })
  isRetired: boolean;

  @DeleteDateColumn({nullable: true})
  deletedOn: Date;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  setGroupsetBrand(groupsetBrand: string) {
    this.groupsetBrand = GroupsetBrand[groupsetBrand];
  }
}
