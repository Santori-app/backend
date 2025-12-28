import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { atob } from 'buffer';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/common/interfaces/AuthRequest';
import { ObjectUtils } from 'src/utils/Object.utils';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    return this.validate(request);
  }

  validate(request: AuthRequest) {
    if (!ObjectUtils.isNullOrUndefined(request.headers.authorization)){
      if (request.headers.authorization.startsWith('Basic ')) {
        const base64Credentials = request.headers.authorization.slice(6).trim();
  
        try {
          const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  
          const [username, password] = decodedCredentials.split(':');
  
          if (username == process.env.USER_REGISTER_USERNAME && password == process.env.USER_REGISTER_PASSWORD) {
            return true;
          } else {
            throw new UnauthorizedException();
          }
        } catch (error) {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}