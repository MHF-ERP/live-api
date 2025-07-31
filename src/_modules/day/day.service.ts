import { Injectable } from '@nestjs/common';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateDayDTO, FilterDayDTO } from './dto/createDay.dto';
import {
  getDayArgs,
  getDayArgsWithSelect,
} from './prisma-args/day.prisma-args';
import { Status } from '@prisma/client';

@Injectable()
export class DayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDayDTO) {
    await this.prisma.day.create({
      data,
    });
  }
  async findCurrent() {
    const { startOfDay, endOfDay } = this.getDates();
    const start = new Date(startOfDay);
    start.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    const data = await this.prisma.day.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                status: Status.ACTIVE,
              },
              {
                status: Status.FINISH,
              },
            ],
          },
          {
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
                      lte: startOfDay,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    return data;
  }
  getDates() {
    const startOfDay = new Date();

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    return { startOfDay, endOfDay };
  }
  async findAll(filters: FilterDayDTO) {
    const args = getDayArgs(filters);
    const argsWithSelect = getDayArgsWithSelect();

    const data = await this.prisma.day[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterDayDTO) {
    const args = getDayArgs(filters);
    return await this.prisma.day.count({
      where: args.where,
    });
  }
  async delete(id: Id): Promise<void> {
    await this.prisma.day.delete({
      where: {
        id,
      },
    });
  }
}
