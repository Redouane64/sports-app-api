import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOptions } from './logging-module.options';

@Global()
@Module({
  imports: [LoggerModule.forRootAsync(loggerModuleOptions)],
})
export class LoggingModule {}
