import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/globals/services/prisma.service';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request & { user: CurrentUser; query: any } = context
      .switchToHttp()
      .getRequest();
    const user: CurrentUser = request.user;
    request.query.userId = user.id;
    return next.handle();
  }
}
