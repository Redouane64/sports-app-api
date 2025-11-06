import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './logging';
import { ConfigModule } from './config';
import { AuthModule } from './auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/typeorm-module-options';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { RecordModule } from './records/record.module';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    UserModule,
    TrackModule,
    RecordModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
