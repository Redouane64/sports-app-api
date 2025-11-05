import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserParams {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(5)
  password!: string;
}
