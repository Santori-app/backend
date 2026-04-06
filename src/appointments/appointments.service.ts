import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/common/errors/api-error.exception';
import { ErrorCode } from 'src/common/errors/error-codes.enum';
import { ListAppointmentsDto } from './dto/list-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAppointmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const { companyId, barberId, offeringId, startAt, phone, name } = data;

      const startDate = new Date(startAt);

      const offering = await tx.offering.findUniqueOrThrow({
        where: { id: offeringId },
      });

      const endAt = this.calculateEndAt(startDate, offering.timeToExecute);

      await this.validateConflict(this.prisma, barberId, startDate, endAt);

      const customer = await this.findOrCreateCustomer(this.prisma, phone, name);

      const appointment = await tx.appointment.create({
        data: {
          companyId,
          barberId,
          offeringId,
          customerId: customer.id,
          startAt: startDate,
          endAt,
          price: offering.price,
        },
      });

      await this.upsertCompanyCustomer(this.prisma, customer.id, companyId, startDate);

      return appointment;
    });
  }

  private calculateEndAt(startAt: Date, durationMinutes: number) {
    return new Date(startAt.getTime() + durationMinutes * 60000);
  }

  private async validateConflict(tx: PrismaService, barberId: string, startAt: Date, endAt: Date) {
    const conflict = await tx.appointment.findFirst({
      where: {
        barberId,
        deletedAt: null,
        status: {
          in: ["SCHEDULED", "CONFIRMED"],
        },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });

    if (conflict) {
      ApiError.forbidden(ErrorCode.APPOINTMENT_CONFLICT);
    }
  }

  private async findOrCreateCustomer(tx: PrismaService, phone: string, name: string) {
    let customer = await tx.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          phone,
          name,
        },
      });
    }

    return customer;
  }

  private async upsertCompanyCustomer(tx: PrismaService, customerId: string, companyId: string, visitDate: Date) {
    await tx.companyCustomer.upsert({
      where: {
        customerId_companyId: {
          customerId,
          companyId,
        },
      },
      update: {
        lastVisit: visitDate,
      },
      create: {
        customerId,
        companyId,
        firstVisit: visitDate,
        lastVisit: visitDate,
      },
    });
  }

  async listByRange(data: ListAppointmentsDto) {
    const { companyId, startDate, endDate } = data;
    
    return this.prisma.appointment.findMany({
      where: {
        companyId,
        deletedAt: null,
        startAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
          },
        },
        offering: {
          select: {
            id: true,
            name: true,
            price: true,
            timeToExecute: true,
          },
        },
      },
      orderBy: {
        startAt: "asc",
      },
    });
  }
}
