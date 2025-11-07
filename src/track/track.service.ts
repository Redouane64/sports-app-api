import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth';
import {
  DistanceFilter,
  ListTracksFilter,
} from './dtos/list-tracks-filter-params.dto';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { CreateTrackParams } from './dtos/create-track-params.dto';
import { UpdateTrackParams } from './dtos/update-track-params.dto';
import { Brackets, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult } from '../common/dtos/paginated-result.dto';
import { TrackStatus } from './interfaces';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async list(
    filter: ListTracksFilter,
    pagination: PaginationParams,
    user?: AuthenticatedUser,
  ) {
    const { authorId, distance, query: q } = filter;

    let query = this.trackRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.author', 'author');

    if (user && filter.myTracks) {
      query = query.where('author_id = :oid', { oid: user.id });
    } else {
      query = query.where('status = :status', { status: TrackStatus.PUBLIC });
    }

    if (authorId) {
      query = query.where('t.author_id = :authorId', { authorId });
    }

    if (q) {
      query = query.andWhere(
        new Brackets((qFilter) =>
          qFilter
            .where(`t.title LIKE :q`, { q: `%${q}%` })
            .orWhere(`t.description LIKE :q`, { q: `%${q}%` }),
        ),
      );
    }

    if (distance?.location) {
      const radius = distance.radius || DistanceFilter.DEFAULT_RADIUS;
      const [lon, lat] = distance.location.split(',');
      query = query.andWhere(
        `ST_DWithin(
          t.location,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radius
        )`,
        { lon: lon, lat: lat, radius, enabled: true },
      );
    } else {
      // if location is not provided by the client, we set enabled flag
      // to false and set [0,0] pair for lan and lon params so the sql
      // is still valid
      query = query.setParameters({ lon: 0, lat: 0, enabled: false });
    }

    pagination ||= new PaginationParams();
    const offset = (pagination.page! - 1) * pagination.perPage!;
    const [tracks, total] = await query
      .offset(offset)
      .limit(pagination.perPage)
      .orderBy('t.created_at', 'DESC')
      .getManyAndCount();

    return new PaginatedResult(tracks, total, pagination);
  }

  async findOne(
    data: { trackId: string; location?: string },
    user?: AuthenticatedUser,
  ) {
    let query = this.trackRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.author', 'author')
      .where(`track.id = :trackId`, {
        trackId: data.trackId,
      });

    if (!user) {
      query = query.andWhere(`track.status = :status`, {
        status: TrackStatus.PUBLIC,
      });
    } else {
      query = query.andWhere(
        new Brackets((qb) =>
          qb
            .where(`track.author_id = :aid`, { aid: user.id })
            .orWhere(`track.status = :status`, { status: TrackStatus.PUBLIC }),
        ),
      );
    }

    if (data.location) {
      const [lon, lat] = data.location.split(',');
      query.setParameters({ lon, lat, enabled: true });
    } else {
      query.setParameters({ lon: 0, lat: 0, enabled: false });
    }

    return await query.getOne();
  }

  create(data: CreateTrackParams, user: AuthenticatedUser) {
    const entity = this.trackRepository.create(data);
    entity.authorId = user.id;
    return this.trackRepository.save(entity, { reload: true });
  }

  async update(
    trackId: string,
    data: UpdateTrackParams,
    user: AuthenticatedUser,
  ) {
    await this.trackRepository.update(
      {
        id: trackId,
        authorId: user.id,
      },
      data,
    );

    return await this.trackRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.author', 'author')
      .where(`track.id = :trackId AND track.author_id = :aid`, {
        trackId,
        aid: user.id,
      })
      .setParameters({ lon: 0, lat: 0, enabled: false })
      .getOne();
  }

  async delete(trackId: string, user: AuthenticatedUser) {
    const entity = await this.trackRepository.findOne({
      where: {
        id: trackId,
        authorId: user.id,
      },
      relations: {
        author: true,
      },
    });

    if (!entity) {
      throw new NotFoundException('entity_not_found');
    }

    await this.trackRepository.delete({ id: trackId });

    return entity;
  }
}
