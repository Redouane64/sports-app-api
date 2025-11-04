import { TokenPayloadOf } from './interfaces';

export {};

declare global {
  type TokenPayload =
    | TokenPayloadOf<'authentication'>
    | TokenPayloadOf<'refresh'>;

  namespace Express {
    type User = TokenPayload;
  }
}
