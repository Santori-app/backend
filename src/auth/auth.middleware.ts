import { HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

  }
    // if (req.headers.authorization !== 'Bearer secret') {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }
}