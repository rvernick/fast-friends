import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Bike } from './bike.entity';
import { AuthGuard, Public } from '../auth/auth.guard';
import { BikeDefinitionService } from './bike-definition.service';

@Controller('bike-definition')
export class BikeDefinitionController {
  constructor(private bikeDefinitionService: BikeDefinitionService) {}
  // update-or-add-maintenance-history-item
  // @UseGuards(AuthGuard)   TODO: put the guard back in
  @Public()               // TODO: add the guard back in
  @Post('bootstrap-brand')
  bootstrap(@Body('brand') brand: string): Promise<void> {
    console.log('bike-definition/', brand);
    return this.bikeDefinitionService.bootStrapBrand(brand);
  }


}
