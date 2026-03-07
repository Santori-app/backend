import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CompleteVerificationDto {
  @IsString()
  @IsNotEmpty()
  verificationToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
}
