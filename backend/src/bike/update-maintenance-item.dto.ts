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

  @IsString()
  action: string;
  
  @IsNumber()
  duemiles: number;

  @IsNumber()
  duedate: number;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  link: string;

  @IsNumber()
  defaultLongevity: number;

  @IsNumber()
  defaultLongevityDays: number;

  @IsBoolean()
  autoAdjustLongevity: boolean;
}
