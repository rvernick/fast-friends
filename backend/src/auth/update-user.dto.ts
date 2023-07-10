import { IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  
  @IsString()
  @IsPhoneNumber('US', {message: 'phone number format: +14158675309'})
  cellPhone: string;
}
