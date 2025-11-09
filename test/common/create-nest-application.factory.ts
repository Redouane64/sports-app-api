import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from '../../src/config/interfaces/config-props.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Reflector } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

/**
 * Sets up a NestJS application for e2e testing with the same configuration
 * as the main application (validation pipes, interceptors, etc.)
 */
export async function CreateNestApplication(): Promise<NestExpressApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  app.set('query parser', 'extended');

  // Apply the same validation pipe configuration as in main.ts
  const configService = app.get(ConfigService);
  const appConfig = configService.get<ConfigProps['app']>('app')!;
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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  return app;
}
