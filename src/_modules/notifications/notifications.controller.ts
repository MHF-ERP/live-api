import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from 'src/firebase/firebase.service';
import { CreateNotificationDTO } from './dto/create.notification.dto';
import { PrismaService } from 'src/globals/services/prisma.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly firebaseService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('send')
  async sendNotification(@Body() body: CreateNotificationDTO) {
    return await this.firebaseService.sendPushNotification(
      body.token,
      'body.title, body.body',
    );
  }

  @Post('send-to-all')
  async sendNotificationToAll() {
    const tokens = await this.prisma.pushToken.findMany({});
    for (const token of tokens) {
      await this.firebaseService.sendPushNotification(
        token.token,
        'body.title, body.body',
      );
    }
    return;
  }
}
