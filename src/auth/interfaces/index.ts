export const PurposeIds = {
  /* these are random unique ids selected to represent a token purpose id */
  authentication: '6b194a82-cd7f-4545-888e-ce7222b6d080',
  refresh: '984a4da9-5188-48ac-b211-17d13ac08ec6',
} as const;

export type JwtPurpose = (typeof PurposeIds)[keyof typeof PurposeIds];

export type SessionOptions = { userAgent: string; ip: string };

export type BaseTokenPayload = {
  jti: string;
  aud: string;
  purpose: JwtPurpose;
};

export interface AuthenticateUser {
  id: string;
  email: string;
  fullName: string;
  sessionId?: string;
}

export type AuthenticationTokenPair = Omit<
  TokenPayload<'authentication'> & TokenPayload<'refresh'>,
  'purpose'
>;

export type RefreshTokenPayload = Pick<AuthenticateUser, 'email'>;

export type TokenPurpose = 'authentication' | 'refresh';

export type TokenPayload<P extends TokenPurpose> = P extends 'authentication'
  ? AuthenticateUser
  : P extends 'refresh'
    ? RefreshTokenPayload
    : never;

export type TokenPayloadOf<P extends TokenPurpose> = BaseTokenPayload &
  TokenPayload<P>;

export interface ClientMetadata {
  ip?: string;
  userAgent?: string;
}
