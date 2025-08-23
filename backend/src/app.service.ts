import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @Inject(ConfigService)
  private readonly configService: ConfigService;
  constructor() {}
  getHello(): string {
    return 'Hello World!';
  }

  getSecrets() {
    return {
      stravaClientId: this.configService.get('STRAVA_CLIENT_ID'),
      stravaSecret: this.configService.get('STRAVA_CLIENT_SECRET'),
      bikeIndexClientId: this.configService.get('BIKE_INDEX_CLIENT_ID'),
      bikeIndexSecret: this.configService.get('BIKE_INDEX_CLIENT_SECRET'),
    };
  }
}
