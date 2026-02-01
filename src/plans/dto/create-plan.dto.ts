import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreatePlanServiceDto {
    @IsString()
    offeringId: string;
  
    @IsInt()
    @Min(1)
    quantity: number;
  }
  
  export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsInt()
    price: number;
  
    @IsEnum(['MONTHLY', 'YEARLY'])
    billingCycle: 'MONTHLY' | 'YEARLY';
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePlanServiceDto)
    services: CreatePlanServiceDto[];
  }
  