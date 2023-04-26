import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findUsername(username: string): Promise<User | null> {
    if (username == null) return null;
    return this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  createUser(username: string, password: string) {
    const newUser = new User(username, password);
    this.usersRepository.insert(newUser);
  }

  updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    this.usersRepository.save(user);
  }


  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
