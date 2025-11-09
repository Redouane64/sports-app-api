import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { RecordStatus } from './dtos/record-status.dto';
import DTW from './distance-scorer-helper';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecordProcessorService {
  private readonly logger = new Logger(RecordProcessorService.name);

  // TODO: this constant might better be moved to environment variable
  // or make it read from db
  private readonly similarityThreshold = 0.05;

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  @Cron('*/5 * * * *')
  async process(): Promise<void> {
    const records = await this.recordRepository.find({
      where: {
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

    await Promise.all(records.map((record) => this.processRecord(record)));
    this.logger.log(`processed ${records.length} records`);
  }

  async processRecord(record: Record): Promise<void> {
    try {
      const { track } = record;
      this.logger.log(
        `[record '${record.id}']: calculating distance similarity score`,
      );

      // the higher distance similarity score the more the two routes deviate
      // from each other.
      const distanceScore = DTW(
        track.route.coordinates,
        record.route.coordinates,
      );

      const status =
        distanceScore > this.similarityThreshold
          ? RecordStatus.REJECTED
          : RecordStatus.ACCEPTED;

      await this.recordRepository.update(record.id, {
        similarityScore: distanceScore,
        status,
      });

      this.logger.log(`record '${record.id}' processed successfully`);
    } catch (error) {
      this.logger.fatal(`failed to process record ${record.id}`);
      this.logger.error(error);
    }
  }
}
