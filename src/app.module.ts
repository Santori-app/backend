import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './cache/cache.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GroupsModule } from './groups/groups.module';
import { CompaniesModule } from './companies/companies.module';
import { CustomersModule } from './customers/customers.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppThrottlerGuard } from './auth/guards/throttler-guard';
import { ConfigModule } from '@nestjs/config';
import { OfferingsModule } from './offerings/offerings.module';
import { PlansModule } from './plans/plans.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    UsersModule, 
    PrismaModule,
    AuthModule,
    AppCacheModule,
    GroupsModule,
    CompaniesModule,
    CustomersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'rate_limit',
          ttl: 60000,
          limit: 50,
        }
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OfferingsModule,
    PlansModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
