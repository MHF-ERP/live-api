import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BatchResponse, MulticastMessage } from 'firebase-admin/messaging';

declare module 'firebase-admin/messaging' {
  interface Messaging {
    sendMulticast(message: MulticastMessage): Promise<BatchResponse>;
  }
}

export enum Topics {
  Admin = 'Admin',
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length && env('NOTIFICATIONS')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = {
      notification: { title, body },
      data,
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`);
      throw new BadRequestException('Failed to send push notification');
    }
  }

  async subscribeToTopic(fcmToken: string, topic: Topics) {
    try {
      await admin.messaging().subscribeToTopic(fcmToken, topic);
    } catch (error) {
      throw new Error(`Failed to subscribe to topic ${topic}: ${error}`);
    }
  }
  async sendToTopic(topic: Topics, title: string, body: string) {
    const message = {
      notification: { title, body },
      topic: topic,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent to ${topic} topic.`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending topic notification: ${error.message}`);
      throw error;
    }
  }
}
