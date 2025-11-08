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
import { ApiProperty } from '@nestjs/swagger';
import { LineString } from 'src/common/dtos/line-string.dto';

export class CreateTrackParams extends PickType(Track, [
  'title',
  'description',
  'location',
  'route',
  'totalTime',
]) {
  @ApiProperty({ required: true, nullable: false })
  @IsString()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: true, nullable: false })
  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location!: GeoJsonLocation;

  @ApiProperty({ required: true, nullable: false })
  @IsObject()
  route!: LineString;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;

  @ApiProperty({
    enum: TrackStatus,
    default: TrackStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(TrackStatus)
  status!: TrackStatus;
}
