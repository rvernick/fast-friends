import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    const result = this.usersRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }

  findUsername(username: string): Promise<User | null> {
    if (username == null) return null;
    const result = this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    this.logger.log('info', 'Searching for: ' + username + ' found: ' + result);
    return result;
  }

  createUser(username: string, password: string) {
    const newUser = new User(username, password);
    this.usersRepository.insert(newUser);
  }

  updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    this.usersRepository.save(user);
  }

  updateUser(user: User, mobilePhone: string) {
    user.cellPhone = mobilePhone;
  }


  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
