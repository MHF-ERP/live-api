import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { NotificationService } from 'src/firebase/firebase.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Status } from '@prisma/client';

@Injectable()
export class SendNotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: NotificationService,
    private readonly notificationService: NotificationService,
  ) {}

  async send(title: string) {
    const tokens = await this.prisma.pushToken.findMany({});
    for (const token of tokens) {
      await this.firebaseService.sendPushNotification(token.token, title);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendNotification() {
    console.log('ready');
    const { startOfDay, endOfDay } = this.getDates();
    const start = new Date(startOfDay);
    start.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    const day = await this.prisma.day.findFirst({
      where: {
        status: Status.PENDING,
        OR: [
          {
            AND: [
              {
                date: {
                  gte: startOfDay,
                },
              },
              {
                date: {
                  lte: endOfDay,
                },
              },
            ],
          },
          {
            AND: [
              {
                date: {
                  gte: start,
                },
              },
              {
                date: {
                  lte: startOfDay,
                },
              },
            ],
          },
        ],
      },
    });
    const expireDay = await this.prisma.day.findFirst({
      where: {
        status: Status.ACTIVE,
        expiredDate: {
          lte: startOfDay,
        },
      },
    });
    if (expireDay) {
      await this.prisma.day.update({
        where: {
          id: expireDay.id,
        },
        data: {
          status: Status.FINISH,
        },
      });
    }
    if (day) {
      await this.prisma.day.update({
        where: {
          id: day.id,
        },
        data: {
          status: Status.ACTIVE,
        },
      });
      await this.send(day.title);
    }

    const situation = await this.prisma.situation.findFirst({
      where: {
        date: new Date(),
      },
    });
    if (situation) {
      await this.send(situation.title);
    }
  }
  getDates() {
    const startOfDay = new Date();

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    return { startOfDay, endOfDay };
  }
}
