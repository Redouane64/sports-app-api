import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackParams } from './create-track-params.dto';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { GeoJsonLocation } from './list-tracks-filter-params.dto';

export class UpdateTrackParams extends PartialType(CreateTrackParams) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location?: GeoJsonLocation;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  public?: boolean;
}
