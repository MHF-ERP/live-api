import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/_modules/user/services/user.service';
import {
  NotificationService,
  Topics,
} from 'src/globals/services/notification.service';
import { PrismaService } from 'src/globals/services/prisma.service';

export function SendNotification({
  topic,
  title,
  body,
}: {
  topic?: Topics;
  title: string;
  body: string;
}) {
  @Injectable()
  class SendNotification implements NestInterceptor {
    constructor(
      public readonly notification: NotificationService,
      public readonly userService: UserService,
      public readonly prisma: PrismaService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest() as {
        user: CurrentUser;
      };
      return next.handle().pipe(
        tap(async () => {
          if (topic) {
            await this.notification.sendToTopic(topic, title, body);
          } else {
            const token = await this.userService.getFcmToken(request.user.jti);
            if (token)
              await this.notification.sendPushNotification(token, title, body);
            await this.prisma.notification.create({
              data: {
                title,
                body,
                userId: request.user.id,
              },
            });
          }
        }),
      );
    }
  }

  return SendNotification;
}
