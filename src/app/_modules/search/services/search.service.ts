import { Injectable } from '@nestjs/common';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { PrismaService } from 'src/globals/services/prisma.service';
import { FilterSearchDTO } from '../dto/search.dto';
import {
  findModelsWithNameAndStringOrJsonFields,
  getFieldType,
} from '../helpers/findModelsWithName.helper';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  getAllowedModels() {
    const data = findModelsWithNameAndStringOrJsonFields();
    return data;
  }

  async search(dto: FilterSearchDTO) {
    const { models } = dto;
    const data = [];
    for (const modelDto of models) {
      const { model, fields, value, page, limit } = modelDto;

      const { modelData, total } = await this.searchModel(
        model,
        fields,
        value,
        page,
        limit,
      );
      data.push({
        model,
        data: modelData || [],
        total: total || 0,
      });
    }

    return data;
  }

  private async searchModel(
    model: string,
    fields: string[],
    value: string,
    page: number,
    limit: number,
  ) {
    const fieldsType = [];
    for (const field of fields) {
      const type = getFieldType(model, field);
      fieldsType.push({ field, type });
    }
    const fieldsFilter = [];
    for (const { field, type } of fieldsType) {
      const filters = await this.searchField(field, type, value);
      fieldsFilter.push(...filters);
    }
    let omit = {};
    if (model === 'User') {
      omit = { password: true };
    }
    const pagination = paginateOrNot({ limit, page }, false);
    const data = await this.prisma[model].findMany({
      where: {
        OR: fieldsFilter,
      },
      ...pagination,
      omit,
    });

    const total = await this.prisma[model].count({
      where: {
        OR: fieldsFilter,
      },
    });
    return {
      modelData: data,
      total,
    };
  }
  private async searchField(field: string, type: string, value: string) {
    if (type === 'String') {
      const filters = {
        [field]: {
          contains: value,
        },
      };
      return [filters];
    } else if (type === 'Json') {
      const languages = await this.prisma.language.findMany({});
      const filters = languages.map((lang) => ({
        [field]: {
          path: `$.${lang.key}`,
          string_contains: value,
        },
      }));
      return filters;
    }
    return [];
  }
}
