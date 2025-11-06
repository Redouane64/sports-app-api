import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/sections/database.config';
import { User } from 'src/user/entities/user.entity';
import { Session } from 'src/auth/entities/session.entity';
import { Track } from 'src/track/entities/track.entity';
import { Record } from 'src/records/entities/record.entity';

export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig = configService.get<DatabaseConfig>('database')!;
    return {
      applicationName: 'sports-app-api',
      type: 'postgres',
      url: databaseConfig.url,
      entities: [User, Session, Track, Record],
      synchronize: false,
      logger: 'advanced-console',
      logging: 'all',
    };
  },
};
