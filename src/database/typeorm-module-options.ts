import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/sections/database.config';
import { User } from 'src/user/entities/user.entity';

export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig = configService.get<DatabaseConfig>('database')!;
    return {
      applicationName: 'sports-app-api',
      type: 'postgres',
      url: databaseConfig.url,
      entities: [User],
      synchronize: false,
      logger: 'advanced-console',
      logging: 'all',
    };
  },
};
