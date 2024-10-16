import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { PasswordReset } from './user/password-reset.entity';
import { Bike } from './bike/bike.entity';
import { MaintenanceItem } from './bike/maintenance-item.entity';
import { BatchProcess } from './batch/batch-process.entity';
import { Notification } from './bike/notification';
import { MaintenanceHistory } from './bike/maintenance-history.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Bike, MaintenanceItem, MaintenanceHistory, PasswordReset, Notification, BatchProcess],
  migrations: ["./migrations/*"],
  subscribers: [],
});
