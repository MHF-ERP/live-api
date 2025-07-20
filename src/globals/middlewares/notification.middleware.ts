import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../services/prisma.service';
import * as jwt from 'jsonwebtoken';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: NotificationService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const method = req.method.toLowerCase();
    const endpoint = req.originalUrl.split('/api/')[1];

    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();
    const token = authHeader?.split(' ')[1];
    if (!token) next();

    const userToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await this.prisma.user.findUnique({
      where: { id: userToken['id'] },
      select: {
        id: true,
        Role: true,
        email: true,
        phone: true,
      },
    });
    const locale = await this.prisma.session.findUnique({
      where: { jti: userToken['jti'] },
      select: { languageId: true },
    });
    const SystemNotification = await this.prisma.systemNotification.findMany({
      where: {
        senderId: user.Role.key,
        event: `${endpoint}_${method}`,
      },
    });

    for (const notification of SystemNotification) {
      if (notification.notification) {
        await this.service.sendNotification(
          locale,
          notification,
          userToken['jti'],
        );
      }
    }

    next();
  }
}
