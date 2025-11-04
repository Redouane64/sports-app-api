import type { AppConfig } from '../sections/app.config';
import { AuthConfig } from '../sections/auth.config';
import { DatabaseConfig } from '../sections/database.config';
import { LoggerConfig } from '../sections/logger.config';

export interface ConfigProps {
  app: AppConfig;
  logging: LoggerConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
}
