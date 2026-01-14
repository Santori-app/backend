import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/onboarding')
  onboarding(@Body() createCompanyDto: CreateCompanyOnboardingDto) {
    return this.companiesService.onboarding(createCompanyDto);
  }
}
