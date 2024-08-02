import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateBikeDto {
  @IsString()
  username: string;

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  type: string;
  
  @IsString()
  groupsetBrand: string;

  @IsNumber()
  groupsetSpeed: number;

  @IsBoolean()
  isElectronic: boolean;
}
