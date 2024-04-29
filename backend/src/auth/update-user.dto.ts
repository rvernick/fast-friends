import { Matches, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(
    /^\d{10}$/,
    {message: 'Phone number should be exactly 10 digits.'}
  )
  mobile: string;

  @IsString()
  stravaCode: string;

  @IsString()
  stravaAccessToken: string;

  @IsString()
  stravaRefreshToken: string;
}
