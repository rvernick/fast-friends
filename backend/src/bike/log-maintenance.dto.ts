import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator'

export class MaintenanceLogDto {
  @IsNumber()
  bikeid: number;

  @IsNumber()
  maintenanceItemId: number;

  @IsNumber()
  nextDue: number;
}

export class MaintenanceLogRequestDto {
  @IsString()
  username: string;

  @ArrayMinSize(1)
  @IsArray()
  logs: MaintenanceLogDto[];
}


