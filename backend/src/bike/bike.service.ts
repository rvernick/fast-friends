import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Bike,  } from './bike.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateBikeDto } from './update-bike.dto';
import { DeleteBikeDto } from './delete-bike.dto';
import { MaintenanceItem } from './maintenance-item.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { MaintenanceChecker } from './maintenance-checker';
import { StravaService } from './strava.service';
import { UserService } from '../user/user.service';
import { Notification } from './notification';
import { UpdateMaintenanceItemDto } from './update-maintenance-item.dto';
import { Part } from './part';
import { BatchProcessService } from '../batch/batch-process.service';


@Injectable()
export class BikeService {
  private readonly logger = new Logger(BikeService.name);
  private maintenanceChecker: MaintenanceChecker;

  constructor(
    @InjectRepository(Bike)
    private bikesRepository: Repository<Bike>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(MaintenanceItem)
    private maintenanceItemsRepository: Repository<MaintenanceItem>,
    @Inject(BatchProcessService)
    private lastRunService: BatchProcessService,
    @Inject(UserService)
    private userService: UserService,
    @Inject(StravaService)
    private stravaService: StravaService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getMaintenanceChecker(): MaintenanceChecker {
    if (!this.maintenanceChecker || !this.maintenanceChecker.isReady()) {
      this.maintenanceChecker = new MaintenanceChecker(
        this.stravaService,
        this.userService,
        this.notificationRepository,
        this.lastRunService,
      );
    }
    return this.maintenanceChecker;
  }

  findAll(): Promise<Bike[]> {
    return this.bikesRepository.find();
  }

  findOne(id: number): Promise<Bike | null> {
    const result = this.bikesRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }

  save(bike: Bike): Promise<Bike> {
    return this.bikesRepository.save(bike);
  }

  
  unlinkFromStrava(user: User) {
    user.stravaId = null;
    user.stravaCode = null;
    user.stravaAccessToken = null;
    user.stravaRefreshToken = null;
    this.userService.save(user);
    for (const bike of user.bikes) {
      bike.stravaId = null;
      this.bikesRepository.save(bike);
    }
  }

  async getBike(bikeId: number, username: string): Promise<Bike | null> {
    try {
      this.runMaintenanceChecks();
      const result = await this.bikesRepository.findOne({
        where: {
          id: bikeId,
          user: { username },
        },
      });
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  private runMaintenanceChecks() {
    try {
     this.getMaintenanceChecker().runChecks();
    } catch (e: any) {
      console.log('Error running maintenance checks:', e.message);
    }
  }

  // TODO: decide if this should be through bikeRepository
  getBikes(username: string): Promise<Bike[] | null> {
    const userPromise = this.findUsername(username);
    if (userPromise == null) return null;

    return userPromise
      .then((user: User) => {
        console.log('getBikes: '+ user.bikes.length);
        console.log('getBikes user: '+ JSON.stringify(user));
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
      if (user == null) {
        console.log('User not found: ', bikeDto.username);
        return null;
      }
      var bike: Bike;
      if (bikeDto.id == 0) {
        bike = new Bike();
      } else {
        const id = bikeDto.id;
        bike = await this.bikesRepository.findOneBy({ id });
        if (bike == null) {
          console.log('Bike not found: ', id);
          return null;
        }
      }
      const stravaId = bike.stravaId
      if (stravaId == null || stravaId.length == 0) {
        bike.odometerMeters = bikeDto.odometerMeters;
        console.log("updating odometer because stravaId is null:" + bikeDto.odometerMeters);
      } else {
        console.log("not updating odometer because stravaId is not null:" + stravaId);
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

  async getMaintenanceItems(username: string, bikeId: number = 0, latest: boolean = true): Promise<MaintenanceItem[]> {
    const user = await this.findUsername(username);
    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(MaintenanceItem, "maintenanceItem")
      .innerJoin("maintenanceItem.bike", "bike")
      .innerJoin("bike.user", "user")
      .where("user.id = :id", { id: user.id })
    
    if (bikeId!= 0) {
      queryBuilder.andWhere("bike.id = :bikeId", { bikeId: bikeId });
    }

    if (latest) {
      queryBuilder.andWhere("maintenanceItem.completed = false");
    }
    const result = await queryBuilder.getMany();
    this.logger.log('info', 'Maintenance items for user'+ username + ':'+ result.length);
    return queryBuilder.getMany();
  };

// TODO: this should use username to ensure the maintenanceItems are only for the user
  async getMaintenanceItem(maintenanceId: number, username: string): Promise<MaintenanceItem> {
    try {
      const result = await this.maintenanceItemsRepository.findOne({
        where: {
          id: maintenanceId,
        },
      });
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  };

  getPartFor(partCode: string): Part | null {
    const vals = Object.values(Part);
    const keys = Object.keys(Part)
    for (const checkKey in keys) {
      this.logger.log('info', 'checking: ' + checkKey + ' vs ' + vals[checkKey])
      if (vals[checkKey] === partCode) {
        this.logger.log('info', 'Found part: ' + checkKey + ' from ' + partCode)
        this.logger.log('info', 'Returning: ' + Part[keys[checkKey]])
        return Part[keys[checkKey]];
      }
    }
    this.logger.log('error', 'Part not found for code'+ partCode);
    return null;
  }

  async updateOrAddMaintenanceItem(maintenanceInfo: UpdateMaintenanceItemDto): Promise<MaintenanceItem> {
    try {
      var maintenanceItem = new MaintenanceItem();
      if (maintenanceInfo.id == 0) {
        const bike = await this.findOne(maintenanceInfo.bikeid);
        if (bike == null) {
          console.error('Bike not found for user '+ maintenanceInfo.username +' and bikeid '+ maintenanceInfo.bikeid);
          return null;
        }
        maintenanceItem.bike = bike;
        console.log('Updated maintenance item: ', JSON.stringify(bike));
        console.log('Updated maintenance item: ', JSON.stringify(maintenanceItem));
        console.log('Updated maintenance item id: ', maintenanceItem.id);
      } else {
        maintenanceItem = await this.getMaintenanceItem(maintenanceInfo.id, maintenanceInfo.username);
        if (maintenanceItem == null) {
          console.error('Maintenance item not found for user '+ maintenanceInfo.username +' and id '+ maintenanceInfo.id);
          return null;
        }
      }

      const part = this.getPartFor(maintenanceInfo.part);
      if (part !== null) {
        maintenanceItem.part = part;
      }
      maintenanceItem.dueDistanceMeters = maintenanceInfo.duemiles;
      maintenanceItem.brand = maintenanceInfo.brand;
      maintenanceItem.model = maintenanceInfo.model;
      maintenanceItem.link = maintenanceInfo.link;

      await this.maintenanceItemsRepository.save(maintenanceItem);
      console.log('Updated maintenance item: ', JSON.stringify(maintenanceItem));
      console.log('Returning maintenance item: ', maintenanceItem.id);
      return maintenanceItem;
    } catch (error) {
      console.error('Error updating or adding bike: ', error);
      return null;
    }
  }

  async deleteMaintenanceItem(maintenanceId: number, username): Promise<void> {
    try {
      const maintenanceItem = await this.getMaintenanceItem(maintenanceId, username);
      if (maintenanceItem == null) {
        console.error('Maintenance item not found for user '+ username +' and id '+ maintenanceId);
        return;
      }
      await this.maintenanceItemsRepository.softDelete(maintenanceItem.id);
    } catch (error) {
      console.error('Error deleting maintenance item: ', error);
      throw error;
    }
  }

  private findUsername(username: string): Promise<User | null> {
    return this.userService.findUsername(username)
  }
}
