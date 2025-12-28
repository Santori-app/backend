import { Role } from 'src/generated/prisma/enums';
import { User } from '../entities/user.entity';
import { IsBoolean, IsDate, IsEmail, IsEmpty, IsInt, IsString, Matches, MaxLength, MinLength, ValidateIf, IsOptional, isIn, Max, Min, IsNotEmpty, IsEnum, IsPhoneNumber } from 'class-validator';

export class CreateUserAdminDto {
  
  @MaxLength(50)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @Matches(/^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?((9\d{4}[-.\s]?\d{4})|(\d{4}[-.\s]?\d{4}))$/, {
    message: 'Phone must be a valid Brazilian phone number. Formats accepted: (11) 98765-4321, (11) 987654321, 11987654321, +5511987654321, (11) 3456-7890'
  })
  phone: string;
}