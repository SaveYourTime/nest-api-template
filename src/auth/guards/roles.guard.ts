import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/user.entity';
import { Role } from '../../roles/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const acceptedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!acceptedRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return user?.roles?.some((role: Role) => acceptedRoles.includes(role.name));
  }
}
