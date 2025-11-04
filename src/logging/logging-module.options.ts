import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import pino from 'pino';
import { ConfigProps } from 'src/config/interfaces/config-props.interface';

export const loggerModuleOptions: LoggerModuleAsyncParams = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Params => {
    const loggingConfig = configService.get<ConfigProps['logging']>('logging');
    const targets: pino.TransportTargetOptions<Record<string, any>>[] = [
      {
        target: 'pino-pretty',
        level: loggingConfig?.level || 'debug',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          singleLine: true,
        },
      },
    ];

    return {
      exclude: ['/healthz', '/swagger', '/favicon.ico'],
      pinoHttp: {
        transport: {
          targets,
        },
        genReqId: () => randomUUID(),
      },
    };
  },
};
