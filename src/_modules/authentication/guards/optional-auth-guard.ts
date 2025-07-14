import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('Optional') {
  handleRequest(_, user, __, ___: ExecutionContext) {
    // Return user if authenticated, otherwise return null and continue
    return user || null;
  }
}
