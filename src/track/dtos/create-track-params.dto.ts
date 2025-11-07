import { PickType } from '@nestjs/mapped-types';
import { Track } from '../entities/track.entity';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeoJsonLocation } from './list-tracks-filter-params.dto';
import { TrackStatus } from '../interfaces';
import { type LineString } from 'typeorm';

export class CreateTrackParams extends PickType(Track, [
  'title',
  'description',
  'public',
  'location',
  'route',
  'totalTime',
]) {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location!: GeoJsonLocation;

  @IsObject()
  route!: LineString;

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
