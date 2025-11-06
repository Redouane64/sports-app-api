import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackParams } from './create-track-params.dto';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
  IsEnum,
  IsInt,
  IsPositive,
} from 'class-validator';
import { GeoJsonLocation } from './list-tracks-filter-params.dto';
import { TrackStatus } from '../interfaces';

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
  @IsObject()
  route?: object;

  @IsOptional()
  @IsInt()
  @IsPositive()
  totalDistance?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;

  @IsOptional()
  @IsEnum(TrackStatus)
  status!: TrackStatus;
}
