import { registerAs } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoggerConfig {
  level: string;
}

export default registerAs('logger', () => {
  const config: LoggerConfig = {
    level: process.env.LOGGING_LEVEL,
  };
  return config;
});
