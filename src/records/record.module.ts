import { Module } from '@nestjs/common';
import { RecordController } from './records.controller';
import { RecordService } from './records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { TrackModule } from 'src/track/track.module';
import { RecordProcessorService } from './record-processor.service';
import { ConditionalModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfig } from 'src/config/sections/app.config';

const schedulingEnvironments: Array<AppConfig['nodeEnv']> = [
  'development',
  'production',
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
    ConditionalModule.registerWhen(
      ScheduleModule.forRoot({
        cronJobs: true,
      }),
      (env) => schedulingEnvironments.includes(env.NODE_ENV),
      { debug: false },
    ),
    TrackModule,
  ],
  controllers: [RecordController],
  providers: [RecordService, RecordProcessorService],
})
export class RecordModule {}
