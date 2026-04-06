import { IsUUID, IsDateString, IsString, IsOptional, MinLength } from "class-validator";

export class CreateAppointmentDto {
  @IsUUID()
  companyId: string;

  @IsUUID()
  barberId: string;

  @IsUUID()
  offeringId: string;

  @IsDateString()
  startAt: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  name: string;
}