import { PickType } from '@nestjs/mapped-types';
import { RegisterUserParams } from './register.dto';

export class LoginUserParams extends PickType(RegisterUserParams, [
  'email',
  'password',
]) {}
