import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { FilterNotificationDTO } from '../dto/notification.dto';
import { getNotificationArgs } from '../prisma-args/notification.prisma-args';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findNotification(filters: FilterNotificationDTO) {
    const args = getNotificationArgs(filters);
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        ...args,
      }),
      this.prisma.notification.count({ where: args.where }),
    ]);
    await this.prisma.notification.create({
      data: { userId: 100, title: ',', body: 'm' },
    });
    return { data, total };
  }
}
