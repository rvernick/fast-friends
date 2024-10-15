import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateMaintenanceItemDto {
  @IsString()
  username: string;

  @IsNumber()
  id: number;

  @IsNumber()
  bikeid: number;

  @IsString()
  part: string;
  
  @IsNumber()
  duemiles: number;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  link: string;

  @IsNumber()
  defaultLongevity: number;

  @IsBoolean()
  autoAdjustLongevity: boolean;
}
