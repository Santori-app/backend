import { Role } from "src/generated/prisma/enums";

export class CurrentUserEntity {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
  companyName: string;
  }