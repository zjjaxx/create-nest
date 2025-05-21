import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from './roles.type';

export const PERMISSION_KEY = '__PermissionKey__';
export const Permission = (...roles: PermissionAction[] | string[]) =>
  SetMetadata(PERMISSION_KEY, roles);

export const PermissionCreate = () =>
  SetMetadata(PERMISSION_KEY, [PermissionAction.Create]);

export const PermissionUpdate = () =>
  SetMetadata(PERMISSION_KEY, [PermissionAction.Update]);
export const PermissionRead = () =>
  SetMetadata(PERMISSION_KEY, [PermissionAction.Read]);
export const PermissionDelete = () =>
  SetMetadata(PERMISSION_KEY, [PermissionAction.Delete]);
