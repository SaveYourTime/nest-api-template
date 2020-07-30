import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const acceptedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!acceptedRoles) return true;

    const request = context.switchToHttp().getRequest();
    return request.user?.roles?.some((role: string) => acceptedRoles.includes(role));
  }
}
