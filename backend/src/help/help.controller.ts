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
import { AddCommentDto } from './add-comment.dto';

@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @HttpCode(HttpStatus.OK)
  @Get('request')
  @UseGuards(AuthGuard)
  getHelpRequest(@Query("id") id: number): Promise<HelpRequest | null> {
    console.log('help/request ');
    return this.helpService.getHelpRequest(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('requests')
  @UseGuards(AuthGuard)
  getHelpRequests(@Query("limit") limit: number): Promise<HelpRequest[] | null> {
    console.log('help/requests ');
    return this.helpService.getRecentOpenHelpRequests(limit);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('my-open-requests')
  resolveHelpRequest(@Query("username") username: string): Promise<HelpRequest[] | null> {
    console.log('help/my-open-requests'+ username);
    return this.helpService.getOpenHelpRequests(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update-or-add-help-request')
  @UseGuards(AuthGuard)
  create(@Body() helpDto: HelpRequestDto): Promise<HelpRequest | null> {
    console.log('help/update-or-add-help-request ' + JSON.stringify(helpDto));
    return this.helpService.addOrUpdate(helpDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('add-comment')
  addHelpRequestComment(@Body() commentDto: AddCommentDto): Promise<HelpRequest | null> {
    console.log('help/add-comment'+ JSON.stringify(commentDto));
    return this.helpService.addHelpRequestComment(commentDto);
  }
  
}