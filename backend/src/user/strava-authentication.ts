import { IsString } from 'class-validator'

export class StravaAuthenticationDto {
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
