import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtModuleOptions } from './jwt-module.options';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync(jwtModuleOptions)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
