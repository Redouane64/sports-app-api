import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { RecordStatus } from './dtos/record-status.dto';
import DTW from './distance-scorer-helper';

@Injectable()
export class RecordProcessorService {
  private readonly logger = new Logger(RecordProcessorService.name);

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async process(recordId: string): Promise<void> {
    this.logger.log(`started processing record '${recordId}'`);
    const record = await this.recordRepository.findOne({
      where: {
        id: recordId,
        status: RecordStatus.DRAFT,
      },
      relations: {
        track: true,
        author: true,
      },
      select: {
        route: true,
        track: {
          route: true,
          totalDistance: true,
        },
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!record) {
      throw new Error('record_not_found');
    }

    const { track } = record;
    this.logger.log(
      `[record '${recordId}']: calculating distance similarity score`,
    );
    const distanceScore = DTW(
      track.route.coordinates,
      record.route.coordinates,
    );
    record.similarityScore = distanceScore;

    // the higher distance similarity score the more the two routes deviate
    // from each other.
    if (distanceScore > 0.05) {
      record.status = RecordStatus.REJECTED;
    } else {
      record.status = RecordStatus.ACCEPTED;
    }

    await this.recordRepository.save(record);
  }
}
