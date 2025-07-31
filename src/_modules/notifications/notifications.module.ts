import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from 'src/firebase/firebase.service';
import { SendNotificationService } from './notification.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationService, SendNotificationService],
})
export class NotificationsModule {}
