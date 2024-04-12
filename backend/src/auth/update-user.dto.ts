import { IsPhoneNumber, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsPhoneNumber('US', {message: 'phone number format: +14158675309'})
  mobile: string;
}
