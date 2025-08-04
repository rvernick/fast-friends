import { IsBoolean, IsNumber, IsString } from 'class-validator'

export const NULL_OPTIONAL_FIELD_ID = -1;

export class UpdateBikeDto {
  @IsString()
  username: string;

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  odometerMeters: number;

  @IsString()
  type: string;

  @IsString()
  groupsetBrand: string;

  @IsNumber()
  groupsetSpeed: number;

  @IsBoolean()
  isElectronic: boolean;

  @IsBoolean()
  isRetired: boolean;

  year: string;

  brand: string;

  model: string;

  line: string;

  bikeDefinitionId?: number;
}
