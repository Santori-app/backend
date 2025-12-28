import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {
  
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set. Make sure you have a .env file with DATABASE_URL defined.');
    }
    
    const adapter = new PrismaMariaDb(databaseUrl);
    const options: Prisma.PrismaClientOptions = { adapter };
    
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
  }
}