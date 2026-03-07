import { Request } from "express";
import { CurrentUserEntity } from "src/users/entities/currentUserDecorator.entity";

export type AuthUser =
  | CurrentUserEntity
  | { needsVerification: true; userId: string; companyId: string };

export interface AuthRequest extends Request {
  user: AuthUser;
}