import { PickType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';
import { IsArray, IsDateString, IsObject } from 'class-validator';

export class CreateRecordParams extends PickType(Record, [
  'route',
  'timestamps',
]) {
  @IsObject()
  route!: object;

  @IsArray()
  @IsDateString({}, { each: true })
  timestamps!: Date[];
}
