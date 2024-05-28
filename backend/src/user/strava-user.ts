import { IsInt, IsString } from 'class-validator'

export class StravaUserDto {
  @IsString()
  username: string;

  @IsString()
  stravaCode: string;
}
