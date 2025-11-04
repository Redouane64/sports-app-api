import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './logging';
import { ConfigModule } from './config';

@Module({
  imports: [ConfigModule, LoggingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
