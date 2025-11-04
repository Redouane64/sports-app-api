import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/sections/database.config';

export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig = configService.get<DatabaseConfig>('database')!;
    return {
      applicationName: 'TopPass.Backend',
      type: 'postgres',
      url: databaseConfig.url,
      entities: [],
      synchronize: false,
      logger: 'advanced-console',
      logging: 'all',
    };
  },
};
