import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { CreateUserBarberDto } from './dto/create-user-barber.dto';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post('/admins')
  createAdmins(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersService.createAdmins(createUserAdminDto);
  }

  @IsPublic()
  @Post('/customers')
  createCustomers(@Body() createUserCustomerDto: CreateUserCustomerDto) {
    return this.usersService.createCustomers(createUserCustomerDto);
  }
  
  @Post('/barbers')
  createBarbers(@Body() createUserBarberDto: CreateUserBarberDto) {
    return this.usersService.createBarbers(createUserBarberDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
