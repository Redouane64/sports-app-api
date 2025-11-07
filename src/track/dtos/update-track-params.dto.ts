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
import { type LineString } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackParams extends PartialType(CreateTrackParams) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location?: GeoJsonLocation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  route?: LineString;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TrackStatus)
  status?: TrackStatus;
}
