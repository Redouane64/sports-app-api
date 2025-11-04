export const PurposeIds = {
  authentication: '6b194a82-cd7f-4545-888e-ce7222b6d080',
  refresh: '984a4da9-5188-48ac-b211-17d13ac08ec6',
  verify: '59f3f833-6d27-4884-bd9d-f0b2e1a30320',
  organization: 'd661681b-81ce-4c59-9ce1-c7fb93da4f9f',
  organizationInviteActivation: 'b1e142b4-97ac-4aa8-b576-ec84ddbb3307',
} as const;

export type JwtPurpose = (typeof PurposeIds)[keyof typeof PurposeIds];

export type SessionOptions = { userAgent: string; ip: string };

export type BaseTokenPayload = {
  jti: string;
  aud: string;
  purpose: JwtPurpose;
};

export interface User {
  id: string;
  email: string;
}

export type AuthenticationTokenPair = Omit<
  TokenPayload<'authentication'> & TokenPayload<'refresh'>,
  'purpose'
>;

export type RefreshTokenPayload = Pick<User, 'email'>;

export type TokenPurpose =
  | 'authentication'
  | 'refresh'
  | 'verify'
  | 'organization'
  | 'organizationInviteActivation';

export type TokenPayload<P extends TokenPurpose> = P extends 'authentication'
  ? User
  : P extends 'refresh'
    ? RefreshTokenPayload
    : never;

export type TokenPayloadOf<P extends TokenPurpose> = BaseTokenPayload &
  TokenPayload<P>;
