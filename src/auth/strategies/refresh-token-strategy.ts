import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigProps } from '../../config';
import { ConfigService } from '@nestjs/config';
import { PurposeIds, RefreshTokenPayload, TokenPayloadOf } from '../interfaces';

export const RefreshTokenStrategyName = 'token-refresh';

export class RefreshTokenGuard extends AuthGuard(RefreshTokenStrategyName) {}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  RefreshTokenStrategyName,
) {
  // NOTE: refresh token only valid after access_token expires
  //       thus any requests before refresh token's nbf date fails
  //       with unauthorized status code
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
