import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './logging';
import { ConfigModule } from './config';
import { AuthModule } from './auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/typeorm-module-options';
import { TrackModule } from './track/track.module';
import { RecordModule } from './records/record.module';
import { ConditionalModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ConditionalModule.registerWhen(
      LoggingModule,
      (env) => env.NODE_ENV !== 'test',
      { debug: false },
    ),
    AuthModule,
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    TrackModule,
    RecordModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
