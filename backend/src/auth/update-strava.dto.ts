import { IsString } from 'class-validator'

export class UpdateStravaDto {
  @IsString()
  username: string;

  @IsString()
  stravaCode: string;
}
