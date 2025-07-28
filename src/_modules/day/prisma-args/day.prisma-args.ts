import { Day, Prisma } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { filterKey } from 'src/globals/helpers/prisma-filters';
import { FilterDayDTO } from '../dto/createDay.dto';

export const getDayArgs = (query: FilterDayDTO) => {
  const { page, limit, ...filter } = query;
  const searchArray = [filterKey<Day>(filter, 'id')].filter(
    Boolean,
  ) as Prisma.DayWhereInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
  } as Prisma.DayFindManyArgs;
};

export const selectDayOBJ = () => {
  const selectArgs: Prisma.DaySelect = {
    date: true,
    title: true,
    description: true,
  };
  return selectArgs;
};
export const getDayArgsWithSelect = () => {
  return {
    select: selectDayOBJ(),
  } satisfies Prisma.DayFindManyArgs;
};
