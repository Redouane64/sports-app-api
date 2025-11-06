import { PickType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';

export class CreateTrackRecordParams extends PickType(Record, [
  'trackId',
  'route',
  'timestamps',
]) {}
