import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  public async canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
