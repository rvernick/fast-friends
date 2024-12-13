import { IsNumber, IsString } from 'class-validator'

export class AddCommentDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  comment: string;
}
