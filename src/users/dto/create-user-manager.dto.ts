import { Role } from 'src/generated/prisma/enums';
import { User } from '../entities/user.entity';
import { IsBoolean, IsDate, IsEmail, IsEmpty, IsInt, IsString, Matches, MaxLength, MinLength, ValidateIf, IsOptional, isIn, Max, Min, IsNotEmpty, IsEnum, IsPhoneNumber } from 'class-validator';

export class CreateUserDto extends User {
  
  @MaxLength(50)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsEnum(Role)
  role: Role;
}