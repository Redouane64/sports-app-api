import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticateUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthenticateUser | null => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return request['user'] as AuthenticateUser;
  },
);
