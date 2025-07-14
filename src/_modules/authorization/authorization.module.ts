import { Module } from '@nestjs/common';
import { PermissionController } from './controller/permission.controller';
import { RoleController } from './controller/role.controller';
import { PermissionService } from './services/permissions.service';
import { RoleService } from './services/roles.service';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService],
})
export class AuthorizationModule {}
