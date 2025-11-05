import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthenticateUser, PurposeIds, TokenPayloadOf } from '../interfaces';
import { ConfigProps } from '../../config';

@Injectable()
export class DefaultStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const authConfig = configService.get<ConfigProps['auth']>('auth')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  validate(payload: TokenPayloadOf<'authentication'>): AuthenticateUser | null {
    if (payload.purpose !== PurposeIds.authentication) {
      return null;
    }

    // TODO: add user store look up logic
    const user = {
      id: payload.id,
      email: payload.email,
    };

    if (!user) {
      return null;
    }

    return user;
  }
}
