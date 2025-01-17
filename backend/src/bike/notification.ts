import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MaintenanceItem } from './maintenance-item.entity';

export enum NotificationStatus {
  CREATED = "created",
  SENT = "sent",
  FAILED = "failed",
}

export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

@Entity()
export class Notification {
  // user.username, 'Overdue Maintenance Items', user, overdueMaintenanceItems
  constructor(user: User, title: string, maintenanceItems: MaintenanceItem[]) {
    this.user = user;
    this.title = title;
    this.maintenanceItems = maintenanceItems;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { nullable: false, cascade: false })
  user: User;

  @ManyToMany(() => MaintenanceItem)
  @JoinTable()
  maintenanceItems: MaintenanceItem[];

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.CREATED,
    nullable: false,
  })
  status: NotificationStatus;

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.EMAIL,
    nullable: false,
  })
  type: NotificationType;
  
  @DeleteDateColumn({nullable: true})
  deletedOn: Date;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
