import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator'

export class MaintenanceLogDto {
  @IsNumber()
  bikeId: number;

  @IsNumber()
  maintenanceItemId: number;

  @IsNumber()
  nextDue: number;

  @IsNumber()
  nextDueDate: number;
}

export class MaintenanceLogRequestDto {
  @IsString()
  username: string;

  @ArrayMinSize(1)
  @IsArray()
  logs: MaintenanceLogDto[];
}


