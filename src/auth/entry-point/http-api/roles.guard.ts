import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../shared/types/user-role.enum';
import { ROLES_KEY } from './roles.decorator';
import { ValidateTokenService } from '../../application/auth-manage.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private validateTokenService: ValidateTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    try {
      const token = authHeader.split(' ')[1];
      const user = await this.validateTokenService.execute(token);
      request.user = user;
      return requiredRoles.some((role) => user.role === role);
    } catch {
      return false;
    }
  }
}
