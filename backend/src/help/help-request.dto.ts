import { ArrayMinSize, IsArray, IsBoolean, IsNumber, IsString } from 'class-validator'

export class HelpRequestDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  part: string;

  @IsString()
  action: string;

  @IsString()
  needType: string;

  @IsString()
  description: string;

  @IsBoolean()
  resolved: boolean;
}


