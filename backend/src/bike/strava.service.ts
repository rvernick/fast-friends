import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Bike,  } from './bike.entity';
import { HttpService } from '@nestjs/axios';
// import { default as strava, Strava } from 'strava-v3';
import { get, post } from '../utils/http-utils';

const logger = new Logger('StravaService');

@Injectable()
export class StravaService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Bike)
    private bikesRepository: Repository<Bike>,
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  async updateBikes(user: User): Promise<User> {
    const stravaAthlete = await this.getStravaAthlete(user);
    if (stravaAthlete == null) {
      console.error('Athlete not found on Strava for bike '+ user.username);
      return user;
    }
    const stravaBikes = stravaAthlete.bikes;
    for (const bike of user.bikes) {
      try {
        var stravaBike = stravaBikes.find((b) => bike.stravaId != null && b.id === bike.stravaId);
        if (stravaBike && stravaBike !== null) {
          console.log('Updating Strava bike mileage from ' + bike.odometerMeters + ' to'+ stravaBike.distance);
          bike.odometerMeters = stravaBike.distance;
          this.bikesRepository.save(bike);
        } else {
          console.error('Strava bike not found for bike '+ user.username +' id: '+ bike.id + ' stravaId: '+ bike.stravaId);
        }
      } catch (error) {
        console.error('Error updating bike odometer: ', error);
      }
    }
    return user;
  }

    async getStravaAthlete(user: User): Promise<any> {
    if (this.httpService == null) {
      logger.error('HttpService is not available');
      return null;
    }
    logger.log('Getting Strava bike for bike with '+ this.httpService);
    logger.log('Getting Strava bike for bike with '+ JSON.stringify(this.httpService));
    

    if (user == null || user.stravaCode == null) {
      console.error('User or stravacode '+ user.stravaId + ' code: ' + user.stravaCode +'is not available');
      return null;
    }
    const token = await this.getToken(user);
    
    if (token == null) return null;

    const stravaAthlete = await get('https://www.strava.com/api/v3/athlete', {}, token.access_token);
    console.log('Strava athlete: returned '+ JSON.stringify(stravaAthlete));

    if (stravaAthlete == null || stravaAthlete.bikes == null) {
      return null;
    }
    return stravaAthlete;
  }

  async getToken(user: User): Promise<any | null> {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    const refreshToken = user.stravaRefreshToken;
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      console.log('Getting token ');
      const response = await post('https://www.strava.com/oauth/token', params);
      if (response) {
        console.log('token exchange result: ' + JSON.stringify(response));
        if (response.refresh_token != null) {
          user.stravaRefreshToken = response.refresh_token;
          await this.usersRepository.save(user);
        }
        return response;
      }
      logger.error(`Failed to get token ` + JSON.stringify(params));
      return null;
    } catch(e: any) {
      logger.error(`Error getting token: ${e.message}`);
    }
    console.error('Failed to get token');
    return null;
  }
};
