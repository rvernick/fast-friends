import { IsString } from 'class-validator'

export class StravaUserDto {
  @IsString()
  username: string;

  @IsString()
  stravaCode: string;

  @IsString()
  stravaToken: string;

  @IsString()
  stravaTokenType: string;

  @IsString()
  stravaAthlete: string;
}
