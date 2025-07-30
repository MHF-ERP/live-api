import { Module } from '@nestjs/common';
import { NotificationService } from './firebase.service';

@Module({
  providers: [NotificationService],
})
export class FirebaseModule {}
