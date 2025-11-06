import {
  Equals,
  IsBoolean,
  IsLatLong,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsLonLatTuple } from '../validators/is-lat-lon-tuple.validator';

export class GeoJsonLocation {
  @IsOptional()
  @IsString()
  @Equals('Point')
  type?: 'Point';

  @IsOptional()
  @IsLonLatTuple()
  coordinates?: [number, number];
}

export class DistanceFilter {
  public static DEFAULT_RADIUS = 10; // 10km

  @IsLatLong()
  location!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  radius?: number;
}

export class ListTracksFilter {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DistanceFilter)
  distance?: DistanceFilter;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  myTracks?: boolean;

  @IsOptional()
  @IsUUID()
  authorId?: string;
}
