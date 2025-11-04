import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserParams } from './dto/login.dto';
import { RegisterUserParams } from './dto/register.dto';
import { type Request, type Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators';
import { type TokenPayloadOf } from './interfaces';
import { AuthService } from './auth.service';
import { PlatformConstants } from '../common';
import { AuthResult } from './dto/auth-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginUserParams) {
    return {};
  }

  @Post('register')
  @UseGuards(RefreshTokenGuard)
  register(@Body() data: RegisterUserParams) {
    return {};
  }

  async refreshToken(
    @CurrentUser() user: TokenPayloadOf<'refresh'>,
    @Req() request: Request,
  ): Promise<AuthResult> {
    const [accessToken, refreshToken] = await this.authService.refreshToken(
      user,
      {
        ip: request.headers[PlatformConstants.USER_IP_HEADER]?.toString(),
        userAgent: request.headers['user-agent'],
      },
    );
    return { accessToken, refreshToken };
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.sendStatus(HttpStatus.NO_CONTENT).send();
  }
}
