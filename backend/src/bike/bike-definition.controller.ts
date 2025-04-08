import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard, Public } from '../auth/auth.guard';
import { BikeDefinitionService } from './bike-definition.service';
import { BikeDefinition } from './bike-definition.entity';

@Controller('bike-definition')
export class BikeDefinitionController {
  constructor(private bikeDefinitionService: BikeDefinitionService) {}
  // update-or-add-maintenance-history-item
  // @UseGuards(AuthGuard)   TODO: put the guard back in
  @Public()               // TODO: add the guard back in
  @Post('bootstrap')
  bootstrap(@Body('year') year: string): Promise<void> {
    try {
      console.log('bootstrap/', year);
      this.bikeDefinitionService.bootStrapAll(year);
      return;
    } catch (error) {
      console.log('bike-definition/bootstrap error:', error);
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @Get('all-brands')
  getAllBrands(): Promise<string[]> {
    console.log('bike-definition/all-brands');
    return this.bikeDefinitionService.getAllBrands();
  }

  @UseGuards(AuthGuard)
  @Get('models-for-brand')
  getModelsFor(@Query('brand') brand: string): Promise<string[]> {
    console.log('bike-definition/models-for-brand');
    return this.bikeDefinitionService.getAllModelsForBrand(brand);
  }

  @UseGuards(AuthGuard)
  @Get('definitions')
  getDefinitions(@Query('brand') brand: string, @Query('model') model: string, @Query('line') line: string): Promise<BikeDefinition[]> {
    return this.bikeDefinitionService.getBikeDefinitionsFor(brand, model, line);
  }
}
