import { Injectable } from '@nestjs/common';
import { CreateCompanyOnboardingDto, UserResponseDto } from './dto/create-company-onboarding.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async onboarding(createCompanyOnboardingDto: CreateCompanyOnboardingDto): Promise<{
    company: Company;
    admin: UserResponseDto;
  }> {
    try {
      return await this.prisma.$transaction(async (tx) => {
  
        const slugExists = await tx.company.findUnique({
          where: { slug: createCompanyOnboardingDto.company.slug },
          select: { id: true },
        });
  
        if (slugExists) {
          ApiError.conflict(ErrorCode.COMPANY_SLUG_ALREADY_EXISTS);
        }
        
        if (createCompanyOnboardingDto.company.cnpj) {
          const cnpjExists = await tx.company.findUnique({
            where: { cnpj: createCompanyOnboardingDto.company.cnpj },
            select: { id: true },
          });

          if (cnpjExists) {
            ApiError.conflict(ErrorCode.COMPANY_CNPJ_ALREADY_EXISTS);
          }
        }
  
        let user = await tx.user.findUnique({
          where: { email: createCompanyOnboardingDto.admin.email },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        });
  
        if (!user) {
          user = await tx.user.create({
            data: {
              email: createCompanyOnboardingDto.admin.email,
              name: createCompanyOnboardingDto.admin.name,
              phone: createCompanyOnboardingDto.admin.phone,
              password: null,
            },
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
            },
          });
        }
  
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
}
