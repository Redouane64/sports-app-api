import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthenticatedUser | null => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return request['user'] as AuthenticatedUser;
  },
);
