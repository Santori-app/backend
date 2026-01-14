import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { User } from './entities/user.entity';
import { ObjectUtils } from 'src/utils/Object.utils';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/generated/prisma/enums';
import { CreateUserBarberDto } from './dto/create-user-barber.dto';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';

@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService) {}

  private async createUser(
    data: {
      email?: string;
      phone?: string;
      name?: string;
      role: Role;
    },
    options: {
      requiredAll?: (keyof typeof data)[];
      requiredAny?: (keyof typeof data)[];
    }
  ) {
    const { requiredAll = [], requiredAny = [] } = options;

    for (const field of requiredAll) {
      if (!data[field]) {
        ApiError.badRequest(ErrorCode.MISSING_REQUIRED_FIELDS);
      }
    }

    if (requiredAny.length > 0 && !requiredAny.some((field) => Boolean(data[field]))) {
      ApiError.badRequest(ErrorCode.MISSING_REQUIRED_FIELDS);
    }

    const orConditions = [
      data.email ? { email: data.email } : undefined,
      data.phone ? { phone: data.phone } : undefined,
    ].filter(Boolean);
    
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: orConditions,
      },
      select: { id: true },
    });
  
    if (existingUser) {
      ApiError.conflict(ErrorCode.USER_ALREADY_EXISTS);
    }
  
    return this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
  }
  

  async createAdmins(createUserAdminDto: CreateUserAdminDto) {
    return this.createUser(
      {
        email: createUserAdminDto.email,
        phone: createUserAdminDto.phone,
        name: createUserAdminDto.name,
        role: Role.ADMIN,
      },
      {
        requiredAll: ['email', 'phone', 'name'],
      }
    );
  }

  async createBarbers(createUserBarberDto: CreateUserBarberDto) {
    console.log(createUserBarberDto)
    return this.createUser(
      {
        email: createUserBarberDto.email,
        phone: createUserBarberDto.phone,
        role: Role.BARBER,
      },
      {
        requiredAny: ['email', 'phone'],
      }
    );
  }

  async createReceptions() {

  }

  async createManagers() {

  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  findOne(id: string) {
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
}
