import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Bike } from './bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bike])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
