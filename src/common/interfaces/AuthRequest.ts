import { Request } from "express";
import { CurrentUserEntity } from "src/users/entities/currentUserDecorator.entity";

export interface AuthRequest extends Request {
  user: CurrentUserEntity
}