import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './logging';
import { ConfigModule } from './config';
import { AuthModule } from './auth';

@Module({
  imports: [ConfigModule, LoggingModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
