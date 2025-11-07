import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { RecordStatus } from './dtos/record-status.dto';
import DTW from './distance-scorer-helper';
import timer from 'node:timers/promises';

@Injectable()
export class RecordProcessorService {
  private readonly logger = new Logger(RecordProcessorService.name);

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async process(recordId: string): Promise<void> {
    try {
      // wait for 5 seconds because this code may run before the row is inserted
      // in the database
      await timer.setTimeout(5000);

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
          id: true,
          route: true,
          track: {
            id: true,
            route: true,
            totalDistance: true,
          },
        },
      });

      if (!record) {
        this.logger.warn(`record ${recordId} not found`);
        return;
      }

      const { track } = record;
      this.logger.log(
        `[record '${recordId}']: calculating distance similarity score`,
      );
      // the higher distance similarity score the more the two routes deviate
      // from each other.
      const distanceScore = DTW(
        track.route.coordinates,
        record.route.coordinates,
      );
      record.similarityScore = distanceScore;

      // TODO: this constant might better be moved to environment variable
      // or make it read from db
      if (distanceScore > 0.05) {
        record.status = RecordStatus.REJECTED;
      } else {
        record.status = RecordStatus.ACCEPTED;
      }

      await this.recordRepository.update(record.id, record);
      this.logger.log(`record '${recordId}' processed successfully`);
    } catch (error) {
      this.logger.fatal(`failed to process record ${recordId}`);
      this.logger.error(error);
    }
  }
}
