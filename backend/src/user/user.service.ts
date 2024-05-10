import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, createNewUser } from './user.entity';
import { Bike } from './bike.entity';
import { StravaUserDto } from './strava-user';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Bike)
    private bikesRepository: Repository<Bike>,
    private readonly httpService: HttpService,
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
        return this.syncUserToStrava(user, stravaUserDto);
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
    const athlete = await this.getStravaAthlete(stravaUserDto.stravaToken);
    this.logger.log('info', 'Syncing user:'+ JSON.stringify(user));
    console.log(athlete);
    for (const bike of athlete.bikes) {
      this.addStravaBike(user, bike);
    }
    return user;
  }

  private addStravaBike(user: User, bike: any) {
    const newBike = new Bike();
    newBike.name = bike.name;
    newBike.stravaId = bike.id;
    newBike.type = bike.type;
    newBike.user = user;
    user.addBike(newBike);
    this.bikesRepository.save(newBike);
    this.logger.log('info', 'Adding bike:'+ JSON.stringify(newBike));
    console.log('created and added: ' + JSON.stringify(newBike));
  }

  private async getStravaAthlete(stravaAccessToken: string): Promise<any> {
    const parameters = {
      headers: {
        Authorization: 'Bearer '+ stravaAccessToken,
      },
    }
    const stravaCall = this.httpService.get('https://www.strava.com/api/v3/athlete', parameters);
    const { data }  = await firstValueFrom(
      stravaCall.pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
