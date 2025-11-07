import { ApiProperty } from '@nestjs/swagger';

export class AuthResult {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}
