import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from 'src/common/interfaces/AuthRequest';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Jwt } from 'src/decorators/current-jwt.decorator';
import { BasicAuthGuard } from './guards/basic-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.body);
  }

  @IsPublic()
  @Get('health_check')
  async healthCheck() {
    return { msg: "Successfully request." };
  }

  @Post('logout')
  @IsPublic()
  async logout(@CurrentUser() user: User, @Jwt() jwt: string) {
    return this.authService.logout(jwt);
  }
 
  @Get('me')
  async me(@CurrentUser() user: User) {
    return user;
  }
}
