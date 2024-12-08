import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { PasswordReset } from './user/password-reset.entity';
import { Bike } from './bike/bike.entity';
import { MaintenanceItem } from './bike/maintenance-item.entity';
import { BatchProcess } from './batch/batch-process.entity';
import { Notification } from './bike/notification';
import { MaintenanceHistory } from './bike/maintenance-history.entity';
import { Instruction } from './instruction/instruction.entity';
import { InstructionReference } from './instruction/instruction-reference.entity';
import { Step } from './instruction/step.entity';
import { ToolNeed } from './instruction/tool-need.entity';
import { Tool } from './instruction/tool.entity';
import { EmailVerify } from './user/email-verify.entity';
import { HelpComment, HelpCommentVote, HelpOffer, HelpRequest } from './help/help-request.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Bike, MaintenanceItem, MaintenanceHistory,
    PasswordReset, Notification, BatchProcess,
    Instruction, InstructionReference, Step, ToolNeed, Tool,
    EmailVerify,
    HelpRequest, HelpComment, HelpCommentVote, HelpOffer
  ],
  migrations: ["./migrations/*"],
  subscribers: [],
});
