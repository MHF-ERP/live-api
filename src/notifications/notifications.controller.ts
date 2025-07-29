import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send')
  async sendNotification(@Body() body: { token: string; title: string; body: string }) {
    return await this.firebaseService.sendNotification(body.token, body.title, body.body);
  }

  @Post('send-to-all')
  async sendNotificationToAll(@Body() body: { tokens: string[]; title: string; body: string }) {
    return await this.firebaseService.sendNotificationToMultiple(body.tokens, body.title, body.body);
  }
}

