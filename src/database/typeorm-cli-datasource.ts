import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  applicationName: 'sports-app-api',
  url: process.env.DATABASE_URL,
  migrationsTransactionMode: 'all',
  migrations: ['../migrations/**/*.ts'],
  entities: ['../**/*.entity.ts'],
  synchronize: false,
  logger: 'advanced-console',
  logging: 'all',
});
