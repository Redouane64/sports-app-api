import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthenticatedUser, PurposeIds, TokenPayloadOf } from '../interfaces';
import { ConfigProps } from '../../config';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const authConfig = configService.get<ConfigProps['auth']>('auth')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  async validate(
    payload: TokenPayloadOf<'authentication'>,
  ): Promise<AuthenticatedUser | null> {
    if (payload.purpose !== PurposeIds.authentication) {
      return null;
    }

    // TODO: Cache this
    const entity = await this.userRepository.findOne({
      where: {
        id: payload.id,
        sessions: {
          id: payload.jti,
        },
      },
      relationLoadStrategy: 'query',
    });

    if (!entity) {
      return null;
    }

    const user: AuthenticatedUser = {
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      sessionId: payload.jti,
    };

    if (!user) {
      return null;
    }

    return user;
  }
}
