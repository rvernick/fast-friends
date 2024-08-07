import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Bike,  } from './bike.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { MaintenanceItem } from './maintenance-item.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class BikeService {
  private readonly logger = new Logger(BikeService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Bike)
    private bikesRepository: Repository<Bike>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Bike[]> {
    return this.bikesRepository.find();
  }

  findOne(id: number): Promise<Bike | null> {
    const result = this.bikesRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }
  
  unlinkFromStrava(user: User) {
    user.stravaId = null;
    user.stravaCode = null;
    user.stravaAccessToken = null;
    user.stravaRefreshToken = null;
    this.usersRepository.save(user);
    for (const bike of user.bikes) {
      bike.stravaId = null;
      this.bikesRepository.save(bike);
    }
  }

  getBike(bikeId: number, username: string): Promise<Bike | null> {
    if (username == null) return null;
    try {
      const result = this.bikesRepository.findOne({
        where: {
          id: bikeId,
        },
      });
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  // TODO: decide if this should be through bikeRepository
  getBikes(username: string): Promise<Bike[] | null> {
    const userPromise = this.findUsername(username);
    if (userPromise == null) return null;

    return userPromise
      .then((user: User) => {
        console.log('user/bikes user: '+ user.bikes.length);
        console.log('user/bikes user: '+ JSON.stringify(user));
        return user.bikes;
      })
      .catch((e: any) => {
        console.log(e.message);
        return [];
      });
  }

  async remove(id: number): Promise<void> {
    await this.bikesRepository.softDelete(id);
  }

  async updateOrAddBike(bikeDto: UpdateBikeDto): Promise<Bike> {
    try {
      const user = await this.findUsername(bikeDto.username);
      if (user == null) return null;

      var bike: Bike;
      if (bikeDto.id == 0) {
        bike = new Bike();
      } else {
        const id = bikeDto.id;
        bike = await this.bikesRepository.findOneBy({ id });
        if (bike == null) return null;
      }
      bike.name = bikeDto.name;
      bike.type = bikeDto.type;
      bike.setGroupsetBrand(bikeDto.groupsetBrand);
      bike.groupsetSpeed = bikeDto.groupsetSpeed;
      bike.isElectronic = bikeDto.isElectronic;
      bike.user = user;
      this.bikesRepository.save(bike);
    } catch (error) {
      console.error('Error updating or adding bike: ', error);
      return null;
    }
  }

  async deleteBike(bikeDto: DeleteBikeDto): Promise<Bike> {
    const user = await this.findUsername(bikeDto.username);
    if (user == null) return null;

    var bike: Bike;
    if (bikeDto.id == 0) {
      bike = new Bike();
    } else {
      const id = bikeDto.id;
      bike = await this.bikesRepository.findOneBy({ id });
      console.log('bike: '+ JSON.stringify(bike));
      if (bike == null) return null;
    }

    this.bikesRepository.softDelete(bike.id);
  }

  async getMaintenanceItems(username: string, bikeId: number = null, latest: boolean = true): Promise<MaintenanceItem[]> {
    const user = await this.findUsername(username);
    const queryBuilder = await this.dataSource.manager
    .createQueryBuilder(MaintenanceItem, "maintenanceItem")
    .innerJoin("maintenanceItem.bike", "bike")
    .innerJoin("bike.user", "user")
    .where("user.id = :id", { id: user.id })
    
    if (bikeId!= null) {
      queryBuilder.andWhere("bike.id = :bikeId", { bikeId: bikeId });
    }

    if (latest) {
      queryBuilder.andWhere("maintenanceItem.completed = false");
    }
    const result = await queryBuilder.getMany();
    this.logger.log('info', 'Maintenance items for user'+ username + ':'+ result.length);
    return queryBuilder.getMany();
  };
  
  private findUsername(username: string): Promise<User | null> {
    if (username == null) return null;
    const result = this.usersRepository.findOne({
      where: {
        username: username.toLocaleLowerCase(),
      },
    });
    return result;
  }
}
