import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard, Public } from '../auth/auth.guard';
import { BikeDefinitionService } from './bike-definition.service';

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

}
