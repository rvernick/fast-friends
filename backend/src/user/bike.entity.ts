import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { MaintenanceItem } from './maintenance-item.entity';

export enum GroupsetBrand {
  SHIMANO = "Shimano",
  SRAM = "SRAM",
  CAMPAGNOLO = "Campagnolo"
}

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
