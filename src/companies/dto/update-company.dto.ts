import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyOnboardingDto } from './create-company-onboarding.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyOnboardingDto) {}
