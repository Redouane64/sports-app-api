import { PickType } from '@nestjs/mapped-types';
import { Track } from '../entities/track.entity';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeoJsonLocation } from './list-tracks-filter-params.dto';

export class CreateTrackParams extends PickType(Track, [
  'title',
  'description',
  'public',
  'location',
]) {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => GeoJsonLocation)
  location!: GeoJsonLocation;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  public!: boolean;
}
