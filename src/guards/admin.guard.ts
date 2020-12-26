
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'
import { UserRole } from 'src/entity/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let req: Request = context.switchToHttp().getRequest()

    return req.params.role === UserRole.ADMIN
  }
}
