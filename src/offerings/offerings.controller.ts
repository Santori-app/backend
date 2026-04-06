import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { CurrentUserEntity } from 'src/users/entities/currentUserDecorator.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offeringsService: OfferingsService) {}

  @Post()
  create(@Body() createOfferingDto: CreateOfferingDto, @CurrentUser() user: CurrentUserEntity) {
    return this.offeringsService.create(createOfferingDto, user.companyId);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserEntity) {
    return this.offeringsService.findAll(user.companyId);
  }

  @Get("public/:companyId")
  @IsPublic()
  async publicFindAll(@Param("companyId") companyId: string) {
    return this.offeringsService.findByCompanyId(companyId);
  }
}
