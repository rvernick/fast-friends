import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { PasswordReset } from './user/password-reset.entity';
import { Bike } from './user/bike.entity';
import { MaintenanceItem } from './user/maintenance-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Bike, MaintenanceItem, PasswordReset],
  migrations: ["./migrations/*"],
  subscribers: [],
});
