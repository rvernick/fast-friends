import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, createNewUser } from './user.entity';
import { Bike } from './bike.entity';
import { StravaUserDto } from './strava-user';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
    const newUser = createNewUser(username, password);
    this.usersRepository.insert(newUser);
  }

  updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    this.usersRepository.save(user);
  }

  updateUser(
      user: User,
      firstName: string,
      lastName: string,
      mobilePhone: string,
      stravaCode: string,
      stravaRefreshToken: string,
      stravaAccessToken: string) {
    if (firstName!= null) user.firstName = firstName;
    if (lastName!= null) user.lastName = lastName;
    if (mobilePhone!= null) user.cellPhone = mobilePhone;
    if (stravaCode!= null) user.stravaCode = stravaCode;
    if (stravaRefreshToken!= null) user.stravaRefreshToken = stravaRefreshToken;
    if (stravaAccessToken!= null) user.stravaAccessToken = stravaAccessToken;
    this.usersRepository.save(user);
  }

  getBikes(username: string): Promise<Bike[] | null> {
    const userPromise = this.findUsername(username);
    if (userPromise == null) return null;
    return userPromise
      .then((user: User) => {
        return user.bikes;
      })
      .catch((e: any) => {
        console.log(e.message);
        return null;
      });

  }

  syncStravaUser(stravaUserDto: StravaUserDto): Promise<User> {
    const userPromise = this.findUsername(stravaUserDto.username);
    if (userPromise == null) return null;
    return userPromise
      .then((user: User) => {
        return syncUserToStrava(user, stravaUserDto);
      })
      .catch((e: any) => {
        console.log(e.message);
        return null;
      });
  }

  private async syncUserToStrava(user: User, stravaUserDto: StravaUserDto): Promise<User> {
    if (user.bikes != null && user.bikes.length > 0) {
      return user;
    }
    const athlete = await getStravaAthlete(stravaUserDto.stravaAccessToken);
    for (const bike of athlete.bikes) {

    }
    return user;
  }

  private async getStravaAthlete(stravaAccessToken: string): Promise<any> {
    
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
