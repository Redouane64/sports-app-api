import { PickType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';
import { IsInt, IsObject, IsOptional, IsPositive } from 'class-validator';
import { LineString } from 'src/common/dtos/line-string.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordParams extends PickType(Record, [
  'route',
  'totalTime',
]) {
  @ApiProperty({
    required: true,
  })
  @IsObject()
  route!: LineString;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;
}
