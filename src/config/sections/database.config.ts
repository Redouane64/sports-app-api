import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const config: DatabaseConfig = {
    url: process.env.DATABASE_URL,
  };

  return config;
});
