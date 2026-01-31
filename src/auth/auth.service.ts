import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUserEntity } from 'src/users/entities/currentUserDecorator.entity';
import { UsersService } from 'src/users/users.service';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly companyService: CompaniesService,
    private readonly jwtService: JwtService,
    private readonly cacheManager: CacheService,
    private prisma: PrismaService
  ) {}

  async validateUser(username: string, password: string) {
    const [login, companySlug] = username.split('@');

    if (!login || !companySlug) {
      ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
    }

    const company = await this.companyService.findBySlug(companySlug);

    if (!company) {
      ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
    }
    
    const user = await this.usersService.findByUsername(login);

    if (!user) {
      ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
    }

    const companyUser = await this.usersService.findCompanyUser(user.id, company.id);

    if (!companyUser) {
      ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
    }

    const isPasswordValid = PasswordHashUtils.isValid(password, user.password);
    if (!isPasswordValid) {
      ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
    }

    delete user.password;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: company.id,
      role: companyUser.role,
    };
  }

  async getUserCompanies(userId: string) {
    const companyUser = await this.prisma.companyUser.findMany({
      where: { userId },
      include: { company: true },
    });

    return companyUser.map(item => ({
      id: item.company.id,
      name: item.company.name,
      slug: item.company.slug,
      role: item.role,
    }));
  }

  async getMe(user: CurrentUserEntity) {
    return user;
  }

  async login(user: CurrentUserEntity) {
    const companies = await this.getUserCompanies(user.id);

    const payload = {
      sub: user.id,
      role: companies[0].role,
      companyId: companies[0].id,
      companyName: companies[0].name
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken
    }
  }

  async logout(jwt: string) {
    await this.cacheManager.storeData(jwt);
  }
}
