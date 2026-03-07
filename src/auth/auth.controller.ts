import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from 'src/common/interfaces/AuthRequest';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserEntity } from 'src/users/entities/currentUserDecorator.entity';
import { Throttle } from '@nestjs/throttler';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';
import { CompleteVerificationDto } from './dto/complete-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ rate_limit: {limit: 10, ttl: 60000} })
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    if ('needsVerification' in req.user && req.user.needsVerification) {
      return this.authService.getRequiresVerificationResponse(req.user);
    }
    return this.authService.login(req.user as CurrentUserEntity);
  }

  @Throttle({ rate_limit: { limit: 10, ttl: 60000 } })
  @IsPublic()
  @Post('complete-verification')
  @HttpCode(HttpStatus.OK)
  async completeVerification(@Body() dto: CompleteVerificationDto) {
    return this.authService.completeVerification(
      dto.verificationToken,
      dto.newPassword,
    );
  }

  //! EXCLUIR POSTERIORMENTE
  @IsPublic()
  @Post('generate-hash')
  @HttpCode(HttpStatus.OK)
  async generateHash(@Body() payload: any) {
    return PasswordHashUtils.toHash(payload.password);
  }
  //! EXCLUIR POSTERIORMENTE

  @Get('me')
  async me(@CurrentUser() user: CurrentUserEntity) {
    return await this.authService.getMe(user);
  }
  
  @Get('me/companies')
  async getUserCompanies(@CurrentUser() user: CurrentUserEntity) {
    return await this.authService.getUserCompanies(user.id);
  }

  // @Post('logout')
  // @IsPublic()
  // async logout(@CurrentUser() user: User, @Jwt() jwt: string) {
  //   return this.authService.logout(jwt);
  // }
}
