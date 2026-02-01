import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
  
  export enum OfferingType {
    SERVICE = 'SERVICE',
    PRODUCT = 'PRODUCT',
  }
  
  export class CreateOfferingDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsEnum(OfferingType)
    type: OfferingType;
  
    @IsInt()
    @Min(0)
    price: number;
  
    /**
     * Tempo em minutos (somente SERVICE)
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    timeToExecute?: number;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    commissionPercent?: number;
  }
  