import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOptions } from './logging-module.options';
import { ConditionalModule } from '@nestjs/config';
import { AppConfig } from 'src/config/sections/app.config';

const loggingEnvironments: Array<AppConfig['nodeEnv']> = [
  'development',
  'production',
];

@Global()
@Module({
  imports: [
    ConditionalModule.registerWhen(
      LoggerModule.forRootAsync(loggerModuleOptions),
      (env) => loggingEnvironments.includes(env.NODE_ENV),
      { debug: false },
    ),
  ],
})
export class LoggingModule {}
