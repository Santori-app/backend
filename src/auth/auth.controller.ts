import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from 'src/common/interfaces/AuthRequest';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Jwt } from 'src/decorators/current-jwt.decorator';
import { Throttle } from '@nestjs/throttler';
import { PasswordHashUtils } from 'src/utils/PasswordHash.utils';

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
  async generateHash(@Request() req: AuthRequest) {
    return PasswordHashUtils.toHash('admin123');
  }
  //! EXCLUIR POSTERIORMENTE

  @Post('/select-company')
  @IsPublic()
  async selectCompany(@CurrentUser() user: User, @Jwt() jwt: string) {
    return this.authService.logout(jwt);
  }

  @Get('me')
  async me(@CurrentUser() user: User) {
    return user;
  }
  
  @Get('me/companies')
  async getUserCompanies(@CurrentUser() user: User) {
    
    const companies = await this.authService.getUserCompanies(user.id);

    return companies.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      role: c.role, // papel do usuário nessa company
    }));
  }

  // @Post('logout')
  // @IsPublic()
  // async logout(@CurrentUser() user: User, @Jwt() jwt: string) {
  //   return this.authService.logout(jwt);
  // }
}
