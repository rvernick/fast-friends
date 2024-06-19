import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateBikeDto {
  @IsString()
  username: string;

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  groupsetBrand: string;

  @IsNumber()
  groupsetSpeed: number;

  @IsNumber()
  odometerMeters: number;

  @IsBoolean()
  isElectronic: boolean;
}
