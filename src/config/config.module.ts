import { Global, Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import appConfig from './sections/app.config';
import loggerConfig from './sections/logger.config';
import authConfig from './sections/auth.config';

@Global()
@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, loggerConfig, authConfig],
      envFilePath: ['.env'],
    }),
  ],
})
export class ConfigModule {}
