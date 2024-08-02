import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

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
    };
  }
}
