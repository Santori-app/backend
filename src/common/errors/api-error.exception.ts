import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ErrorCode } from './error-codes.enum';
  
  export class ApiError {
    static badRequest(code: ErrorCode) {
      throw new BadRequestException({ code });
    }
  
    static conflict(code: ErrorCode) {
      throw new ConflictException({ code });
    }
  
    static notFound(code: ErrorCode) {
      throw new NotFoundException({ code });
    }
  
    static unauthorized(code: ErrorCode) {
      throw new UnauthorizedException({ code });
    }
  
    static forbidden(code: ErrorCode) {
      throw new ForbiddenException({ code });
    }
  
    static internal() {
      throw new InternalServerErrorException({
        code: ErrorCode.INTERNAL_ERROR,
      });
    }
  }
  