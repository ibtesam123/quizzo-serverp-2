
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserRole } from 'src/entity/user.entity';

@Injectable()
export class IdGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async verifyID(req: Request): Promise<boolean> {

    let bToken = req.headers.authorization

    if (!bToken)
      return false

    let tokenArr = bToken.split(' ')

    if (tokenArr.length !== 2)
      return false

    let token = tokenArr[1]

    try {
      let res = this.jwtService.verify<{ id: number, role: UserRole }>(token)

      req.params.id = res.id.toString()
      req.params.role = res.role
      return true

    } catch (_) {
      return false
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let req: Request = context.switchToHttp().getRequest()

    return this.verifyID(req);
  }
}
