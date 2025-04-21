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
import { BikeDefinition, BikeDefinitionSummary } from './bike-definition.entity';

@Controller('bike-definition')
export class BikeDefinitionController {
  constructor(private bikeDefinitionService: BikeDefinitionService) {}

  // update-or-add-maintenance-history-item
  // @UseGuards(AuthGuard)   TODO: put the guard back in
  @Public()               // TODO: add the guard back in
  @Post('bootstrap')
  bootstrap(): Promise<void> {
    try {
      console.log('bootstrap/');
      this.bikeDefinitionService.bootstrapBrandsInternally();
      return;
    } catch (error) {
      console.log('bike-definition/bootstrap error:', error);
      return null;
    }
  }

  // @Public()               // TODO: add the guard back in
  // @Post('bootstrap-models')
  // bootstrapModels(): Promise<void> {
  //   try {
  //     console.log('bootstrap/');
  //     this.bikeDefinitionService.bootstrapModels();

  //     return;
  //   } catch (error) {
  //     console.log('bike-definition/bootstrap error:', error);
  //     return null;
  //   }
  // }

  @UseGuards(AuthGuard)
  @Get('all-brands')
  getAllBrands(): Promise<string[]> {
    console.log('bike-definition/all-brands');
    return this.bikeDefinitionService.getAllBrands();
  }

  @UseGuards(AuthGuard)
  @Get('models-for')
  getModelsFor(@Query('brand') brand: string): Promise<string[]> {
    console.log('bike-definition/models-for', brand);
    if (!brand) {
      return Promise.resolve([]);
    }
    return this.bikeDefinitionService.getAllModelsForBrand(brand);
  }

  @UseGuards(AuthGuard)
  @Get('lines-for')
  getLinesFor(@Query('brand') brand: string, @Query('model') model: string): Promise<string[]> {
    console.log('bike-definition/lines-for');
    return this.bikeDefinitionService.getAllLinesForBrandModel(brand, model);
  }

  @Public()
  // @UseGuards(AuthGuard)
  @Get('search')
  async searchDefinitions(
      @Query('year') year: string,
      @Query('brand') brand: string,
      @Query('model') model: string,
      @Query('line') line): Promise<BikeDefinitionSummary[]> {

    console.log(`bike-definition/search for: ${year} ${brand} ${model} ${line} `);
    const result = await this.bikeDefinitionService.searchDefinitions(year, brand, model, line);
    console.log('bike-definition/search returning: ', result);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('definitions')
  getDefinitions(@Query('brand') brand: string, @Query('model') model: string, @Query('line') line: string): Promise<BikeDefinition[]> {
    return this.bikeDefinitionService.getBikeDefinitionsFor(brand, model, line);
  }
}
