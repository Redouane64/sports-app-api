import type { AppConfig } from '../sections/app.config';
import { LoggerConfig } from '../sections/logger.config';


export interface ConfigProps {
  app: AppConfig;
  logging: LoggerConfig;
}
