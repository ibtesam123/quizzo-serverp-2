
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { DevConfig, DevEnv } from 'src/keys/dev.config';

@Injectable()
export class DevCheckGuard implements CanActivate {

  constructor(
    private readonly devConfig: ConfigService<DevConfig>,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.devConfig.get<DevEnv>('NODE_ENV') === DevEnv.DEVELOPMENT;
  }
}
