import { IsNumber, IsString } from 'class-validator'

export class UpdateMaintenanceHistoryItemDto {
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
  donemiles: number;

  @IsNumber()
  donedate: number;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  link: string;
}
