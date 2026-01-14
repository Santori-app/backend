import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { UserPayload } from 'src/common/interfaces/UserPayload';
import { UserToken } from 'src/common/interfaces/UserToken';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,
    private readonly cacheManager: CacheService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = PasswordHashUtils.isValid(password, user.password);

      if (isPasswordValid) {
        delete user.password;

        return user;
      }
    }
    
    ApiError.unauthorized(ErrorCode.INVALID_CREDENTIALS);
  }

  async getUserCompanies(userId: string) {
    const companies = await this.prisma.companyUser.findMany({
      where: { userId },
      include: { company: true },
    });

    return companies.map(cu => ({
      id: cu.company.id,
      name: cu.company.name,
      slug: cu.company.slug,
      role: cu.role, // role do user nessa company
    }));
  }

  login(user: User): UserToken {
    const payload : UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
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
