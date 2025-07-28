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
}
