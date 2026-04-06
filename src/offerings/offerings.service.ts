import { Injectable } from '@nestjs/common';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfferingsService {

  constructor(private prisma: PrismaService){}

  async create(data: any, companyId: string) {
  
    const {
      name,
      description,
      type,
      price,
      timeToExecute,
      commissionPercent,
    } = data;
  
    if (!name || !type || price == null) {
      return { message: "Campos obrigatórios ausentes" };
    }
  
    if (price < 0) {
      return { message: "Preço inválido" };
    }
  
    if (type === "SERVICE" && !timeToExecute) {
      return { message: "Serviços precisam de timeToExecute" };
    }
  
    const offering = await this.prisma.offering.create({
      data: {
        companyId,
        name,
        description,
        type,
        price,
        timeToExecute,
        commissionPercent,
      },
    });
  
    return offering;
  }

  async findAll(companyId: string) {
    const offerings = await this.prisma.offering.findMany({
      where: {
        companyId,
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return offerings;
  }

  async findByCompanyId(companyId: string) {
    const offerings = await this.prisma.offering.findMany({
      where: {
        companyId,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return offerings;
  }
}
