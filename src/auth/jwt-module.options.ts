import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigProps } from '../config';

export const jwtModuleOptions: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): JwtModuleOptions => {
    const authConfig = configService.get<ConfigProps['auth']>('auth')!;
    return {
      secret: authConfig.jwtSecret,
      verifyOptions: {
        ignoreExpiration: false,
        ignoreNotBefore: false,
      },
      signOptions: {
        expiresIn: authConfig.jwtExpires,
      },
    };
  },
};
