import { Permission } from '@prisma/client';

declare global {
  interface CurrentUser {
    id: Id;
    jti: string;
    Role: UserType;
    permissions?: Permission[];
  }
}

declare module 'express' {
  interface User extends CurrentUser {}
}

export {};
