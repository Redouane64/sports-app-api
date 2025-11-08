import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/sections/database.config';
import { User } from 'src/auth/entities/user.entity';
import { Session } from 'src/auth/entities/session.entity';
import { Track } from 'src/track/entities/track.entity';
import { Record } from 'src/records/entities/record.entity';
import { AppConfig } from 'src/config/sections/app.config';

export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig = configService.get<DatabaseConfig>('database')!;
    const appConfig = configService.get<AppConfig>('app')!;

    const moduleOptions: TypeOrmModuleOptions = {
      applicationName: 'sports-app-api',
      type: 'postgres',
      url: databaseConfig.url,
      entities: [User, Session, Track, Record],
      synchronize: false,
      logger: 'formatted-console',
      logging: 'all',
    };

    if (appConfig.nodeEnv === 'test') {
      Object.assign(moduleOptions, {
        logging: false,
        logger: undefined,
        synchronize: true,
      });
    }

    return moduleOptions;
  },
};
