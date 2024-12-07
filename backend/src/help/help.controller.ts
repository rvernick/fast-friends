import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HelpRequest } from './help-request.entity';
import { HelpService } from './help.service';
import { HelpRequestDto } from './help-request.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @HttpCode(HttpStatus.OK)
  @Get('requests')
  @UseGuards(AuthGuard)
  getHelpRequests(@Query("limit") limit: number): Promise<HelpRequest[] | null> {
    console.log('help/requests ');
    return this.helpService.getRecentOpenHelpRequests(limit);
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-help')
  @UseGuards(AuthGuard)
  create(@Body() helpDto: HelpRequestDto): Promise<HelpRequest | null> {
    console.log('help/update-or-add-help-request ' + JSON.stringify(helpDto));
    return this.helpService.addOrUpdate(helpDto);
  }
  ''
}