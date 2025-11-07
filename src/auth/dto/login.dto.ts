import { PickType } from '@nestjs/mapped-types';
import { RegisterUserParams } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserParams extends PickType(RegisterUserParams, [
  'email',
  'password',
]) {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  password!: string;
}
