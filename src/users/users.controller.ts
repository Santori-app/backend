import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  createBarbers(@Body() createUserBarberDto: CreateUserDto, @CurrentUser() user: CurrentUserEntity) {
    return this.usersService.createCompanyUser(user.companyId, createUserBarberDto, Role.BARBER);
  }

  @Post('/manager')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createManagers(@Body() createUserManagerDto: CreateUserDto, @CurrentUser() user: CurrentUserEntity) {
    return this.usersService.createCompanyUser(user.companyId, createUserManagerDto, Role.MANAGER);
  }

  @Post('/admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createAdmin(@Body() createUserAdminDto: CreateUserDto, @CurrentUser() user: CurrentUserEntity) {
    return this.usersService.createCompanyUser(user.companyId, createUserAdminDto, Role.ADMIN);
  }

  @Post('/reception')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createReception(@Body() createUserReceptionDto: CreateUserDto, @CurrentUser() user: CurrentUserEntity) {
    return this.usersService.createCompanyUser(user.companyId, createUserReceptionDto, Role.RECEPTION);
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

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserEntity,
  ) {
    return this.usersService.update(id, currentUser.companyId, updateUserDto);
  }

  @Patch(':id/company-users/reactivate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  reactivate(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserEntity) {
    return this.usersService.reactivate(id, currentUser.companyId);
  }

  @Patch(':id/company-users/deactivate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  deactivate(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserEntity) {
    return this.usersService.deactivate(id, currentUser.companyId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserEntity) {
    return this.usersService.remove(id, currentUser.companyId);
  }
}
