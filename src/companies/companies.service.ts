import { Injectable } from '@nestjs/common';
import { CreateCompanyOnboardingDto, UserResponseDto } from './dto/create-company-onboarding.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { Company } from './entities/company.entity';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async onboarding(createCompanyOnboardingDto: CreateCompanyOnboardingDto): Promise<{
    company: Company;
    admin: UserResponseDto;
  }> {
    try {
      if (await this.isSlugAlreadyExists(createCompanyOnboardingDto.company.slug)) {
        ApiError.conflict(ErrorCode.COMPANY_SLUG_ALREADY_EXISTS);
      }

      if (await this.isCnpjAlreadyExists(createCompanyOnboardingDto.company.cnpj)) {
        ApiError.conflict(ErrorCode.COMPANY_CNPJ_ALREADY_EXISTS);
      }

      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: createCompanyOnboardingDto.admin.email,
            name: createCompanyOnboardingDto.admin.name,
            phone: createCompanyOnboardingDto.admin.phone,
            username: createCompanyOnboardingDto.admin.username,
            password: PasswordHashUtils.toHash(createCompanyOnboardingDto.company.slug),
          },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            username: true
          },
        });
  
        const company = await tx.company.create({
          data: {
            name: createCompanyOnboardingDto.company.name,
            slug: createCompanyOnboardingDto.company.slug,
            legalName: createCompanyOnboardingDto.company.legalName,
            cnpj: createCompanyOnboardingDto.company.cnpj,
          },
        });
  
        await tx.companyUser.create({
          data: {
            userId: user.id,
            companyId: company.id,
            role: 'ADMIN',
          },
        });
  
        return {
          company,
          admin: user,
        };
      });
    } catch (error) {
      if (error.code === 'P2002') {
        ApiError.conflict(error);
      }
  
      throw error;
    }
  }

  async isCnpjAlreadyExists(cnpj: string) {
    const cnpjExists = await this.prisma.company.findUnique({
      where: { cnpj: cnpj },
      select: { id: true },
    });

    if (cnpjExists) {
      return true;
    }

    return false;
  }

  async isSlugAlreadyExists(slug: string) {
    const slugExists = await this.prisma.company.findUnique({
      where: { slug: slug },
      select: { id: true },
    });

    if (slugExists) {
      return true;
    }

    return false;
  }

  async findBySlug(slug: string) {
    return this.prisma.company.findFirst({
      where: {
        slug,
        active: true,
      },
    });
  }
}
