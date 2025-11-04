import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  host?: string;
  port?: string;
}

export default registerAs<AppConfig>('app', () => {
  const config: AppConfig = {
    nodeEnv: process.env.NODE_ENV as AppConfig['nodeEnv'],
    host: process.env.HOST,
    port: process.env.PORT,
  };

  return config;
});
