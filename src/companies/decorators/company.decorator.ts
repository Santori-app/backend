import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CompanyContext } from '../interfaces/company-context.interface';

export const Company = createParamDecorator(
  (data: keyof CompanyContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const company: CompanyContext | undefined = request.company;

    if (!company) {
      return null;
    }

    if (data) {
      return company[data];
    }

    return company;
  },
);
