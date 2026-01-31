import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { CurrentUserEntity } from './entities/currentUserDecorator.entity';
import { ObjectUtils } from 'src/utils/Object.utils';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/generated/prisma/enums';
import { CreateUserBarberDto } from './dto/create-user-barber.dto';
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

  async createBarber(companyId: string, createUserBarberDto: CreateUserBarberDto) {
    return this.prisma.$transaction(async (tx) => {
      if (!createUserBarberDto.username || !createUserBarberDto.name){
        ApiError.badRequest(ErrorCode.MISSING_REQUIRED_FIELDS);
      }

      const createUser : CreateUser = {
        name: createUserBarberDto.name,
        email: createUserBarberDto.email,
        phone: createUserBarberDto.phone,
        username: createUserBarberDto.username,
        password: PasswordHashUtils.toHash(createUserBarberDto.password)
      }

      const user = await this.createUser(createUser);
  
      await tx.companyUser.create({
        data: {
          userId: user.id,
          companyId,
          role: Role.BARBER,
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
  
}
