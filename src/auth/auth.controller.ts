import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from 'src/common/interfaces/AuthRequest';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserEntity } from 'src/users/entities/currentUserDecorator.entity';
import { Jwt } from 'src/decorators/current-jwt.decorator';
import { Throttle } from '@nestjs/throttler';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';
import { Company } from 'src/companies/decorators/company.decorator';
import { CompanyContext } from 'src/companies/interfaces/company-context.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ rate_limit: {limit: 5, ttl: 60000} })
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
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
