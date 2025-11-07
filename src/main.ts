import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from './config/interfaces/config-props.interface';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.enableCors();
  app.disable('x-powered-by');
  app.useLogger(app.get(PinoLogger));
  app.flushLogs();

  app.set('query parser', 'extended');

  const configService = app.get(ConfigService);
  const appConfig = configService.get<ConfigProps['app']>('app')!;
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: appConfig.nodeEnv === 'production',
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(appConfig.port!);
  const url = await app.getUrl();
  Logger.log(`Listening on ${url} in ${appConfig.nodeEnv} environment`);
}
bootstrap();
