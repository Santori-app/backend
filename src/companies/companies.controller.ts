import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Throttle } from '@nestjs/throttler';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/onboarding')
  onboarding(@Body() createCompanyDto: CreateCompanyOnboardingDto) {
    return this.companiesService.onboarding(createCompanyDto);
  }

  @Get('/public/slug/:slug')
  @Throttle({ rate_limit: {limit: 10, ttl: 60000} })
  @IsPublic()
  async getCompanyBySlug(@Param('slug') slug: string){
    const company = await this.companiesService.findBySlug(slug);

    if (!company) {
      return ApiError.notFound(ErrorCode.COMPANY_NOT_FOUND);
    }

    return {
      id: company.id,
      name: company.name,
      slug: company.slug
    }
  }

}
