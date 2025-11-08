import { Global, Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import appConfig from './sections/app.config';
import loggerConfig from './sections/logger.config';
import authConfig from './sections/auth.config';
import databaseConfig from './sections/database.config';

@Global()
@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, loggerConfig, authConfig, databaseConfig],
      envFilePath: [process.env.NODE_ENV === 'test' ? '.env.test' : '.env'],
    }),
  ],
})
export class ConfigModule {}
