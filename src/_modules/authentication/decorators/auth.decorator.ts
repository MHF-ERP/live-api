import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SessionType } from '@prisma/client';
import { PermissionAndTypeGuard } from '../guards/mix-guard';
import { OptionalAuthGuard } from '../guards/optional-auth-guard';
import { WsJwtGuard } from '../guards/ws.guard';
import { RequiredPermissions } from './permission.decorator';

interface AuthOptions {
  type?: SessionType;
  prefix?: string;
}

export function Auth({ type = SessionType.ACCESS, prefix }: AuthOptions = {}) {
  const guards: any[] = [AuthGuard(type)];

  if (prefix) guards.push(PermissionAndTypeGuard);

  const decorators = [
    RequiredPermissions(prefix),
    UseGuards(...guards),
    ApiBearerAuth(`${type} Token`),
  ];

  return applyDecorators(...decorators);
}

export function WsAuth() {
  return applyDecorators(UseGuards(WsJwtGuard));
}

export function OptionalAuth() {
  return applyDecorators(
    ApiBearerAuth(`Access Token`),
    UseGuards(OptionalAuthGuard),
  );
}
