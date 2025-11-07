import { Module } from '@nestjs/common';
import { RecordController } from './records.controller';
import { RecordService } from './records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { TrackModule } from 'src/track/track.module';
import { RecordProcessorService } from './record-processor.service';
import { RecordEntitySubscriber } from './subscribers/record-entity-subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), TrackModule],
  controllers: [RecordController],
  providers: [RecordService, RecordProcessorService, RecordEntitySubscriber],
})
export class RecordModule {}
