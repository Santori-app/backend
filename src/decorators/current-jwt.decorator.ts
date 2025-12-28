import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../common/interfaces/AuthRequest';

export const Jwt = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const auth = context.switchToHttp().getRequest<AuthRequest>().headers.authorization.slice(6).trim();

    return auth;
  },
);