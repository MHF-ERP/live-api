import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { NotificationService } from 'src/firebase/firebase.service';
import { Cron, CronExpression } from '@nestjs/schedule';

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
    const day = await this.prisma.day.findFirst({
      where: {
        date: new Date(),
      },
    });
    if (day) {
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
}
