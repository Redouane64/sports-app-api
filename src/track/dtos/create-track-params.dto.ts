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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackParams extends PickType(Track, [
  'title',
  'description',
  'location',
  'route',
  'totalTime',
]) {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location!: GeoJsonLocation;

  @ApiProperty()
  @IsObject()
  route!: LineString;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  totalDistance?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TrackStatus)
  status!: TrackStatus;
}
