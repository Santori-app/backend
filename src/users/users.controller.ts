import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { CreateUserBarberDto } from './dto/create-user-barber.dto';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { CompanyContextGuard } from 'src/auth/guards/company-context.guard';
import { CompanyContext } from 'src/companies/interfaces/company-context.interface';
import { Company } from 'src/companies/decorators/company.decorator';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post('/admins')
  @IsPublic()
  createAdmins(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersService.createAdmins(createUserAdminDto);
  }
  
  @Post('/barbers')
  createBarbers(@Body() createUserBarberDto: CreateUserBarberDto) {
    return this.usersService.createBarbers(createUserBarberDto);
  }

  @Get(':id')
  @UseGuards(CompanyContextGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

}
