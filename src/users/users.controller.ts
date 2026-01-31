import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserBarberDto } from './dto/create-user-barber.dto';
import { CurrentUserEntity } from './entities/currentUserDecorator.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post('/barbers')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createBarbers(@Body() createUserBarberDto: CreateUserBarberDto, @CurrentUser() user: CurrentUserEntity) {
    return this.usersService.createBarber(user.companyId, createUserBarberDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll(@CurrentUser() user: CurrentUserEntity) {
    return this.usersService.findAll(user.companyId);
  }

}
