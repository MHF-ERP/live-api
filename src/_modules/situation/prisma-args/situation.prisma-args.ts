import { Prisma, Situation } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { filterKey } from 'src/globals/helpers/prisma-filters';
import { FilterSituationDTO } from '../dto/createSituation.dto';

export const getSituationArgs = (query: FilterSituationDTO) => {
  const { page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Situation>(filter, 'id'),
    filterKey<Situation>(filter, 'dayId'),
  ].filter(Boolean) as Prisma.SituationWhereInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
  } as Prisma.SituationFindManyArgs;
};

export const selectSituationOBJ = () => {
  const selectArgs: Prisma.SituationSelect = {
    date: true,
    title: true,
    description: true,
    SituationOptions: true,
  };
  return selectArgs;
};
export const getSituationArgsWithSelect = () => {
  return {
    select: selectSituationOBJ(),
  } satisfies Prisma.SituationFindManyArgs;
};
