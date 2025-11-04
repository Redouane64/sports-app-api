import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigProps } from '../../config';
import { ConfigService } from '@nestjs/config';
import { PurposeIds, RefreshTokenPayload, TokenPayloadOf } from '../interfaces';

export const RefreshTokenStrategyName = 'refresh-token';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  RefreshTokenStrategyName,
) {
  constructor(configService: ConfigService) {
    const authConfig = configService.get<ConfigProps['auth']>('auth')!;
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  validate(payload: TokenPayloadOf<'refresh'>): RefreshTokenPayload | null {
    if (payload.purpose !== PurposeIds.refresh) {
      return null;
    }

    return {
      email: payload.email,
    };
  }
}
