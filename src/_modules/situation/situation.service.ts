import { Injectable } from '@nestjs/common';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { PrismaService } from 'src/globals/services/prisma.service';
import {
  CreateSituationDTO,
  FilterSituationDTO,
} from './dto/createSituation.dto';
import {
  getSituationArgs,
  getSituationArgsWithSelect,
} from './prisma-args/situation.prisma-args';

@Injectable()
export class SituationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSituationDTO) {
    const { options, ...rest } = data;
    await this.prisma.situation.create({
      data: {
        date: rest.date,
        title: rest.title,
        description: rest.description,
        dayId: rest.dayId,
        SituationOptions: {
          create: options,
        },
      },
    });
  }

  async findCurrent() {
    const { startOfDay, endOfDay } = this.getDates();
    const start = new Date(startOfDay);
    start.setHours(0, 0, 0, 0);
    const data = await this.prisma.situation.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                date: {
                  gte: startOfDay,
                },
              },
              {
                date: {
                  lte: endOfDay,
                },
              },
            ],
          },
          {
            AND: [
              {
                date: {
                  gte: start,
                },
              },
              {
                date: {
                  lt: startOfDay,
                },
              },
            ],
          },
        ],
      },
    });
    return data;
  }
  //
  async findAll(filters: FilterSituationDTO) {
    const args = getSituationArgs(filters);
    const argsWithSelect = getSituationArgsWithSelect();

    const data = await this.prisma.situation[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterSituationDTO) {
    const args = getSituationArgs(filters);
    return await this.prisma.situation.count({
      where: args.where,
    });
  }
  async delete(id: Id): Promise<void> {
    await this.prisma.situation.delete({
      where: {
        id,
      },
    });
  }

  getDates() {
    const startOfDay = new Date();

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    return { startOfDay, endOfDay };
  }
}
