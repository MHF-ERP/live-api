import { Method, PrismaClient } from '@prisma/client';
import { CustomerNotification } from 'src/_modules/user/_modules/customer/providers/notification.customer.provider';
interface SystemNotification {
  id: number;
  title: Json;
  body: Json;
  event: string;
  receiverId: string;
  methods: Method[];
  group: boolean;
}
const SystemNotificationData: SystemNotification[] = [...CustomerNotification];

export async function seedNotification(prisma: PrismaClient) {
  for (const item of SystemNotificationData) {
    for (const method in item.methods) {
      await prisma.systemNotification.upsert({
        where: {
          id: item.id,
        },
        update: {
          title: item.title,
          body: item.body,
          event: item.event,
          receiverId: item.receiverId,
          method: method as Method,
          group: item.group ?? false,
        },
        create: {
          id: item.id,
          title: item.title,
          body: item.body,
          event: item.event,
          receiverId: item.receiverId,
          method: method as Method,
          group: item.group ?? false,
        },
      });
    }
  }
  console.log('✅ Notification seeded');
}
