import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import {
  TokenPurpose,
  TokenPayload,
  TokenPayloadOf,
  AuthenticationTokenPair,
  PurposeIds,
  JwtPurpose,
} from './interfaces';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from '../config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthenticationTokenPair(
    jwtid: string,
    user: AuthenticationTokenPair,
  ) {
    const authConfig = this.configService.get<ConfigProps['auth']>('auth')!;
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken('authentication', user, {
        audience: user.id,
        jwtid,
      }),
      this.generateToken('refresh', user, {
        notBefore: authConfig.jwtExpires,
        expiresIn: authConfig.jwtExpires * 2,
        audience: user.id,
        jwtid,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateToken<P extends TokenPurpose>(
    purpose: P,
    payload: TokenPayload<P>,
    options?: JwtSignOptions,
  ): Promise<string> {
    const data: Record<'purpose', JwtPurpose> = {
      ...payload,
      purpose: PurposeIds[purpose],
    };
    return await this.jwtService.signAsync(data, options);
  }

  async verifyToken<T extends TokenPurpose>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<TokenPayloadOf<T>> {
    return await this.jwtService.verifyAsync(token, options);
  }
}
