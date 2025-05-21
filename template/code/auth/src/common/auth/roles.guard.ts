import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  RolePermissionService,
  PermissionAction,
  RolePermissionKey,
} from './roles.type';
import { PERMISSION_KEY } from './roles.decorator';

interface RequestWithUser {
  user: {
    uid: number;
  };
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(RolePermissionKey)
    public rolePermissionService: RolePermissionService,
    public reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndMerge<PermissionAction[]>(
      PERMISSION_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!permissions) {
      return true;
    }
    const needPermission = permissions.join(':');
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    const userPermission = await this.rolePermissionService.queryRolePermission(
      user.uid,
    );
    return userPermission.some((role) => needPermission === role);
  }
}
