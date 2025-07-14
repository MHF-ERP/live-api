import { mapPermissionConfigToRole } from '../../../../../src/globals/helpers/mapRoles.helper';
import { PermissionMap } from '../permissions.provider';

const adminPermissions: PermissionMap = {
  languages: ['post', 'get', 'delete', 'patch'],
  users: ['get', 'delete', 'patch'],
  roles: ['post', 'get', 'delete', 'patch'],
  profile: ['get', 'patch'],
  permissions: ['get', 'patch'],
} as const satisfies PermissionMap;

export const AdminRole = {
  id: 1,
  name: { en: 'Admin', ar: 'مشرف' },
  key: 'Admin',
  default: true,
  permissions: mapPermissionConfigToRole(adminPermissions),
};
