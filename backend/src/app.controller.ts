import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get()
  health() {
    return 'Up';
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('check')
  isUp() {
    this.logger.log('info', 'health check');
    return 'Check ok';
  }

  @HttpCode(HttpStatus.OK)
  @Get('secrets')
  getSecrets() {
    return this.appService.getSecrets();
  }
}
