import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [NotificationsController],
  providers: [FirebaseService],
})
export class NotificationsModule {}


