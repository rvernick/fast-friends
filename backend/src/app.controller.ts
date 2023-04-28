import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
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
    return 'Check ok';
  }
}
