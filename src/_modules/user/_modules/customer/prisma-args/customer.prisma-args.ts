import { Prisma, User } from '@prisma/client';
import { selectUserOBJ } from 'src/_modules/user/prisma-args/user.prisma-select';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  containsInFields,
  filterKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterCustomerDTO } from '../dto/filter.customer.dto';

export const getCustomerArgs = (query: FilterCustomerDTO) => {
  const { page, limit, ...filter } = query;
  const searchArray = [
    containsInFields(['name'], filter?.name),
    containsInFields(['email'], filter?.email),
    containsInFields(['phone'], filter?.phone),
    filterKey<User>(filter, 'id'),
  ]
    .filter((x) => x)
    .flat();

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    select: selectUserOBJ(),
    where: {
      AND: searchArray,
    },
  } satisfies Prisma.UserFindManyArgs;
};
