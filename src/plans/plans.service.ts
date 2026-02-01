import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        billingCycle: dto.billingCycle,
        planServices: {
          create: dto.services.map((s) => ({
            offeringId: s.offeringId,
            quantity: s.quantity,
          })),
        },
      },
      include: {
        planServices: {
          include: {
            offering: true,
          },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.plan.findMany({
    where: { companyId },
    include: {
      planServices: {
        include: {
          offering: true,
        },
      },
    },
    });
  }
}
