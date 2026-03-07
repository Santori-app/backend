import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?((9\d{4}[-.\s]?\d{4})|(\d{4}[-.\s]?\d{4}))$/, {
    message:
      'Phone must be a valid Brazilian phone number. Formats accepted: (11) 98765-4321, (11) 987654321, 11987654321, +5511987654321, (11) 3456-7890',
  })
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
