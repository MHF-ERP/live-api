import { Prisma } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { filterKey } from 'src/globals/helpers/prisma-filters';
import { FilterNotificationDTO } from '../dto/notification.dto';

export const getNotificationArgs = (query: FilterNotificationDTO) => {
  const { page, limit, ...filter } = query;
  const searchArray = [filterKey(filter, 'userId')].filter(
    Boolean,
  ) as Prisma.NotificationWhereInput[];

  return {
    ...paginateOrNot({ limit, page }, false),
    where: {
      AND: searchArray,
    },
    orderBy: {
      createdAt: 'desc',
      read: 'asc',
    },
  } as Prisma.NotificationFindManyArgs;
};
