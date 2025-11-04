import { Injectable } from '@nestjs/common';
import { TokenPayloadOf } from './interfaces';

@Injectable()
export class AuthService {
  refreshToken(
    user: TokenPayloadOf<'refresh'>,
    meta: { ip: any; userAgent: any },
  ): PromiseLike<[string, string]> {
    throw new Error('Method not implemented.');
  }
}
