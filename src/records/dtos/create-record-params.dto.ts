import { PickType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';
import { IsInt, IsObject, IsOptional, IsPositive } from 'class-validator';
import { type LineString } from 'typeorm';

export class CreateRecordParams extends PickType(Record, [
  'route',
  'totalTime',
]) {
  @IsObject()
  route!: LineString;

  @IsOptional()
  @IsInt()
  @IsPositive()
  totalTime?: number;
}
