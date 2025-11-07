import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenParams {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}
