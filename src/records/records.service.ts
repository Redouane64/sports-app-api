import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { ListRecordFilter } from './dtos/list-records.dto';
import { CreateRecordParams } from './dtos/create-record-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/common/dtos/paginated-result.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private readonly trackService: TrackService,
  ) {}

  async list(
    trackId: string,
    filter: ListRecordFilter,
    pagination: PaginationParams,
    user?: AuthenticatedUser,
  ) {
    let query = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.author', 'author')
      .where(`record.track_id = :trackId`, { trackId });

    // eslint-disable-next-line prefer-const
    let { authorId, ids } = filter;

    if (ids?.length > 0) {
      query = query.andWhereInIds(ids);
    }

    // if author not specified, current user is set as author filter
    authorId ??= user?.id;
    if (authorId) {
      query = query.andWhere(`record.author_id = :authorId`, { authorId });
    }

    pagination ||= new PaginationParams();
    const offset = (pagination.page! - 1) * pagination.perPage!;
    const [tracks, total] = await query
      .offset(offset)
      .limit(pagination.perPage)
      .orderBy('record.created_at', 'DESC')
      .getManyAndCount();

    return new PaginatedResult(tracks, total, total < offset);
  }

  async create(
    trackId: string,
    data: CreateRecordParams,
    user: AuthenticatedUser,
  ) {
    const track = await this.trackService.findOne({ trackId });
    if (!track) {
      throw new NotFoundException('track_not_found');
    }

    const { route, timestamps } = data;
    const entity = await this.recordRepository.save({
      authorId: user.id,
      trackId,
      route,
      timestamps,
    });

    const result = await this.list(
      trackId,
      { ids: [entity.id] },
      { page: 1, perPage: 1 },
    );

    return result.items.pop();
  }

  async delete(recordId: string, user: AuthenticatedUser) {
    await this.recordRepository.delete({
      id: recordId,
      authorId: user.id,
    });
  }
}
