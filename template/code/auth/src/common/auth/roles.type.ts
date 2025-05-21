export interface RolePermissionService {
  queryRolePermission(uid: number): Promise<unknown[]>;
}

export enum PermissionAction {
  Manage = 'manage',
  Create = 'create',
  Update = 'update',
  Read = 'read',
  Delete = 'delete',
}

export const RolePermissionKey = '__RolePermissionKey__';
