import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ApiError } from "src/common/errors/api-error.exception";
import { ErrorCode } from "src/common/errors/error-codes.enum";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user?.id) {
      ApiError.unauthorized(ErrorCode.UNAUTHORIZED);
    }

    const companyId = request.headers['x-company-id'];

    if (!companyId || typeof companyId !== 'string') {
      ApiError.badRequest(ErrorCode.COMPANY_CONTEXT_REQUIRED);
    }

    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId,
        },
      },
      include: {
        company: true,
      },
    });

    if (!companyUser) {
      ApiError.forbidden(ErrorCode.USER_NOT_IN_COMPANY);
    }

    if (!companyUser.active) {
      ApiError.forbidden(ErrorCode.USER_INACTIVE_IN_COMPANY);
    }

    request.company = {
      id: companyUser.companyId,
      role: companyUser.role,
      slug: companyUser.company.slug,
    };

    return true;
  }
}
