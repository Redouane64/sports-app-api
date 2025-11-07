import {
  Body,
  Controller,
  Headers,
  HttpCode,
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
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: `Authenticate user and return authentication token`,
  })
  @ApiOkResponse({
    type: AuthResult,
    description: 'Access token',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect credentials',
  })
  login(
    @Body() data: LoginUserParams,
    @Ip() ip?: string,
    @Headers('User-Agent') userAgent?: string,
  ): Promise<AuthResult> {
    return this.authService.login(data, { userAgent, ip });
  }

  @Post('register')
  @ApiOperation({
    operationId: 'register',
    summary: `Create new user and return authentication tokens`,
  })
  @ApiOkResponse({
    type: AuthResult,
    description: 'Access and refresh token pair',
  })
  register(
    @Body() data: RegisterUserParams,
    @Ip() ip?: string,
    @Headers('User-Agent') userAgent?: string,
  ): Promise<AuthResult> {
    return this.authService.register(data, { userAgent, ip });
  }

  @Post('refresh')
  @UseGuards(AuthGuard(RefreshTokenStrategyName))
  @ApiBearerAuth()
  @ApiOperation({
    operationId: `refreshToken`,
    summary: `refresh an existing authentication token`,
  })
  @ApiQuery({
    name: 'token',
    type: String,
    description: `Refresh token`,
  })
  @ApiOkResponse({
    type: AuthResult,
    description: `A new authentication and refresh tokens`,
  })
  @ApiBadRequestResponse({
    description: `Bad token`,
  })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'logout',
    summary: `Terminate authenticated user session`,
  })
  @ApiNoContentResponse({ description: 'Logout succeeded' })
  async logout(
    @Res() response: Response,
    @CurrentUser() user: TokenPayloadOf<'authentication'>,
  ) {
    await this.authService.logout(user);
  }
}
