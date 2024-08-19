import { IsNumber, IsString } from 'class-validator'

export class DeleteBikeDto {
  @IsString()
  username: string;

  @IsNumber()
  id: number;
}
