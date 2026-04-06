import { Injectable } from '@nestjs/common';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/generated/prisma/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';

interface CreateUser {
  email?  : string;
  name    : string;
  phone?  : string;
  username: string;
  password: string;
}
@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService) {}

  private async createUser(user : CreateUser) {
    if (await this.isExistsUsername(user.username)) 
      ApiError.conflict(ErrorCode.USER_ALREADY_EXISTS);
  
    return this.prisma.user.create({
      data: {
        email: user.email,
        phone: user.phone,
        name: user.name,
        username: user.username,
        password: user.password
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });
  }

  async isExistsUsername(username: string) {
    const existingUser = await this.findByUsername(username);

    if (!existingUser) {
      return false;
    }

    return true;
  }

  async createCompanyUser(companyId: string, createUserDto: CreateUserDto, role: Role) {
    return this.prisma.$transaction(async (tx) => {
      if (!createUserDto.username || !createUserDto.name){
        ApiError.badRequest(ErrorCode.MISSING_REQUIRED_FIELDS);
      }

      const createUser : CreateUser = {
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        username: createUserDto.username,
        password: PasswordHashUtils.toHash(createUserDto.password)
      }

      const user = await this.createUser(createUser);
  
      await tx.companyUser.create({
        data: {
          userId: user.id,
          companyId,
          role,
        },
      });
  
      return user;
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username: username } });
  }

  async findCompanyUser(userId: string, companyId: string) {
    return this.prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
        active: true,
      },
    });    
  }

  findById(id: string) {
    return this.prisma.user.findUnique(
      { 
        where: { 
          id: id 
        }, 
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
        }
      }
    );
  }

  async findAll(companyId: string) {
    if (!companyId) {
      ApiError.badRequest(ErrorCode.COMPANY_CONTEXT_REQUIRED);
    }
  
    const companyUsers = await this.prisma.companyUser.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        role: true,
        active: true,
        verified: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      }      
    });
  
    return companyUsers.map((cu) => ({
      id: cu.user.id,
      name: cu.user.name,
      username: cu.user.username,
      email: cu.user.email,
      phone: cu.user.phone,
      role: cu.role,
      active: cu.active,
      verified: cu.verified,
      createdAt: cu.createdAt,
    }));
  }

  async publicFindAll(companyId: string) {
    if (!companyId) {
      ApiError.badRequest(ErrorCode.COMPANY_CONTEXT_REQUIRED);
    }

    const companyUsers = await this.prisma.companyUser.findMany({
      where: {
        companyId,
        deletedAt: null,
        active: true,
        role: "BARBER",
        verified: true
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      }      
    });

    return companyUsers.map((cu) => ({
      id: cu.user.id,
      name: cu.user.name,
    }));
  }

  async update(
    id: string,
    companyId: string,
    dto: UpdateUserDto,
  ) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId_companyId: { userId: id, companyId },
      },
    });

    if (!companyUser) {
      ApiError.notFound(ErrorCode.USER_NOT_IN_COMPANY);
    }

    if (dto.email !== undefined) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: id } },
      });
      if (existing) ApiError.conflict(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }

    if (dto.role !== undefined) {
      await this.prisma.companyUser.update({
        where: {
          userId_companyId: { userId: id, companyId },
        },
        data: { role: dto.role },
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        username: true,
        updatedAt: true,
      },
    });
  }

  async reactivate(id: string, companyId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId_companyId: { userId: id, companyId },
      },
    });

    if (!companyUser) {
      ApiError.notFound(ErrorCode.USER_NOT_IN_COMPANY);
    }

    await this.prisma.companyUser.update({
      where: {
        userId_companyId: { userId: id, companyId },
      },
      data: { active: true },
    });

    return { success: true };
  }
  
  async deactivate(id: string, companyId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId_companyId: { userId: id, companyId },
      },
    });

    if (!companyUser) {
      ApiError.notFound(ErrorCode.USER_NOT_IN_COMPANY);
    }

    await this.prisma.companyUser.update({
      where: {
        userId_companyId: { userId: id, companyId },
      },
      data: { active: false },
    });

    return { success: true };
  }

  async remove(id: string, companyId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId_companyId: { userId: id, companyId },
      },
    });

    if (!companyUser) {
      ApiError.notFound(ErrorCode.USER_NOT_IN_COMPANY);
    }

    await this.prisma.companyUser.update({
      where: {
        userId_companyId: { userId: id, companyId },
      },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }
}
