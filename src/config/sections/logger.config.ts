import { registerAs } from '@nestjs/config';

export interface LoggerConfig {
  level: string;
}

export default registerAs('logger', () => {
  const config: LoggerConfig = {
    level: process.env.LOGGING_LEVEL,
  };
  return config;
});
