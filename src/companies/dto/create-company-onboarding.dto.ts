import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";

class CompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  legalName: string;

  @Matches(/^\d{14}$/)
  cnpj: string;
}

class AdminUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class CreateCompanyOnboardingDto {
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @ValidateNested()
  @Type(() => AdminUserDto)
  admin: AdminUserDto;
}

export class UserResponseDto {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}