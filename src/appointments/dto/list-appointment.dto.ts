import { IsUUID, IsDateString } from "class-validator";

export class ListAppointmentsDto {
  @IsUUID()
  companyId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}