import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  applicationName: 'sports-app-api',
  url: process.env.DATABASE_URL,
  migrationsTransactionMode: 'all',
  migrations: ['./src/migrations/**/*.ts'],
  entities: ['./src/**/*.entity.ts'],
  synchronize: false,
  logger: 'advanced-console',
  logging: 'all',
});
