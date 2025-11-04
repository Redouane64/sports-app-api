import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpires: number;
}

export default registerAs<AuthConfig>('auth', () => {
  const config: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: +process.env.JWT_TOKEN_EXPIRES,
  };

  return config;
});
