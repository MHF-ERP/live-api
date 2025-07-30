import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from 'src/firebase/firebase.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationService],
})
export class NotificationsModule {}
