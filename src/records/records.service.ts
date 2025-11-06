import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { ListRecordFilter } from './dtos/list-records.dto';
import { CreateTrackRecordParams } from './dtos/create-track-record-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  list(
    filter: ListRecordFilter,
    pagination: PaginationParams,
    user?: AuthenticatedUser,
  ) {
    throw new Error('Method not implemented.');
  }

  create(
    trackId: string,
    data: CreateTrackRecordParams,
    user: AuthenticatedUser,
  ) {
    throw new Error('Method not implemented.');
  }

  delete(recordId: string, user: AuthenticatedUser) {
    throw new Error('Method not implemented.');
  }
}
