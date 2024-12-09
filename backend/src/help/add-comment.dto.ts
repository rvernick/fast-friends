import { IsNumber, IsString } from 'class-validator'

export class AddCommentDto {
  @IsNumber()
  helpRequestId: number;

  @IsString()
  username: string;

  @IsString()
  comment: string;
}


