import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtModuleOptions } from './jwt-module.options';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Session } from './entities/session.entity';
import { TokenService } from './token.service';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';
import { JwtAuthStrategy } from './strategies/auth-strategy';

@Module({
  imports: [
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([Session, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAuthStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
