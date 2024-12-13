import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { HelpComment, HelpCommentVote, HelpOffer, HelpRequest } from './help-request.entity';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Bike } from '../bike/bike.entity';
import { PasswordReset } from '../user/password-reset.entity';
import { EmailVerify } from '../user/email-verify.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Bike, PasswordReset, EmailVerify, HelpRequest, HelpComment, HelpCommentVote, HelpOffer])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    HelpService,
    UserService,
  ],
  controllers: [HelpController],
  exports: [HelpService],
})

export class HelpRequestModule {};
