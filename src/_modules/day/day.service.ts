import { Injectable } from '@nestjs/common';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateDayDTO, FilterDayDTO } from './dto/createDay.dto';
import {
  getDayArgs,
  getDayArgsWithSelect,
} from './prisma-args/day.prisma-args';

@Injectable()
export class DayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDayDTO) {
    await this.prisma.day.create({
      data,
    });
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
