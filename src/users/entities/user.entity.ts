import { Role } from "src/generated/prisma/enums";

export class User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: Role;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  }