import {
  Equals,
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
import { ApiProperty } from '@nestjs/swagger';

export class GeoJsonLocation {
  @ApiProperty({
    default: 'Point',
    example: 'Point',
    required: false,
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @Equals('Point')
  type!: 'Point';

  @ApiProperty({
    isArray: true,
    type: 'number',
    required: true,
    nullable: false,
    example: [16.353935, 48.221922],
  })
  @IsOptional()
  @IsLonLatTuple()
  coordinates?: [number, number];
}

export default class DistanceFilter {
  public static DEFAULT_RADIUS = 5_000; // 5km

  @ApiProperty({
    type: 'string',
    required: true,
    nullable: false,
    example: '16.31868922735373,48.21628072871755',
  })
  @IsLatLong()
  location!: string;

  @ApiProperty({
    type: 'number',
    required: false,
    nullable: false,
    example: 700,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  radius?: number;
}

export class ListTracksFilter {
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    description: 'Client location to calculate distance from the track',
    example: `distance[location]=16.31868922735373,48.21628072871755&distance[radius]=700`,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DistanceFilter)
  distance?: DistanceFilter;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
