import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserParams } from './dto/login.dto';
import { RegisterUserParams } from './dto/register.dto';
import { type Response } from 'express';
import { CurrentUser } from './decorators';
import { type TokenPayloadOf } from './interfaces';
import { AuthService } from './auth.service';
import { PlatformConstants } from '../common';
import { AuthResult } from './dto/auth-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenStrategyName } from './strategies/refresh-token-strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() data: LoginUserParams,
    @Ip() ip?: string,
    @Headers('User-Agent') userAgent?: string,
  ): Promise<AuthResult> {
    return this.authService.login(data, { userAgent, ip });
  }

  @Post('register')
  register(
    @Body() data: RegisterUserParams,
    @Ip() ip?: string,
    @Headers('User-Agent') userAgent?: string,
  ): Promise<AuthResult> {
    return this.authService.register(data, { userAgent, ip });
  }

  @Post('refresh')
  @UseGuards(AuthGuard(RefreshTokenStrategyName))
  async refreshToken(
    @CurrentUser() user: TokenPayloadOf<'refresh'>,
    @Headers('User-Agent') userAgent?: string,
    @Ip() ip?: string,
    @Headers(PlatformConstants.USER_IP_HEADER) platformSpecificIp?: string,
  ): Promise<AuthResult> {
    const [accessToken, refreshToken] = await this.authService.refreshToken(
      user,
      {
        ip: ip || platformSpecificIp,
        userAgent,
      },
    );
    return { accessToken, refreshToken };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Res() response: Response,
    @CurrentUser() user: TokenPayloadOf<'authentication'>,
  ) {
    await this.authService.logout(user);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
