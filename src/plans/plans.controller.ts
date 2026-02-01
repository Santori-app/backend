import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserEntity } from 'src/users/entities/currentUserDecorator.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @CurrentUser() user: CurrentUserEntity) {
    return this.plansService.create(user.companyId, createPlanDto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserEntity) {
    return this.plansService.findAll(user.companyId);
  }
}
