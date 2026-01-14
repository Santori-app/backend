import { Role } from "src/generated/prisma/enums";

export class User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  }