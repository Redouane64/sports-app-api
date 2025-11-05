import { Injectable } from '@nestjs/common';
import { AuthenticateUser } from 'src/auth';
import {
  DistanceFilter,
  ListTracksFilter,
  PaginationParams,
} from './dtos/list-tracks-filter-params.dto';
import { CreateTrackParams } from './dtos/create-track-params.dto';
import { UpdateTrackParams } from './dtos/update-track-params.dto';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult } from './dtos/paginated-result.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async list(
    filter: ListTracksFilter,
    pagination: PaginationParams,
    user?: AuthenticateUser,
  ) {
    const { authorId, distance, query: q } = filter;

    let query = this.trackRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.author', 'author');

    if (user && filter.myTracks) {
      query = query.where('author_id = :oid', { oid: user.id });
    } else {
      query = query.where('public = :public', { public: true });
    }

    if (authorId) {
      query = query.where('t.author_id = :authorId', { authorId });
    }

    if (q) {
      query = query.andWhere((qFilter) =>
        qFilter
          .where(`t.title LIKE %q%`, { q })
          .orWhere(`t.description LIKE %q%`, { q }),
      );
    }

    if (distance?.location) {
      const radius = distance.radius || DistanceFilter.DEFAULT_RADIUS;
      const { lat, lon } = distance.location;
      query.andWhere(
        `ST_DWithin(
          t.location::geography,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radius
        )`,
        { lon, lat, radius },
      );
    }

    pagination ||= new PaginationParams();
    const offset = (pagination.page! - 1) * pagination.perPage!;
    const [tracks, total] = await query
      .offset(offset)
      .limit(pagination.perPage)
      .orderBy('t.created_at', 'DESC')
      .getManyAndCount();

    return new PaginatedResult(tracks, total, total > offset);
  }

  create(data: CreateTrackParams, user: AuthenticateUser) {
    throw new Error('Method not implemented.');
  }

  update(trackId: string, data: UpdateTrackParams, user: AuthenticateUser) {
    throw new Error('Method not implemented.');
  }

  delete(trackId: string, user: AuthenticateUser) {
    throw new Error('Method not implemented.');
  }
}
