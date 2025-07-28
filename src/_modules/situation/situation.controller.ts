import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { isOne } from 'src/globals/helpers/first-or-many';
import { ApiDefaultOkResponse } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { SituationService } from './situation.service';
import {
  CreateSituationDTO,
  FilterSituationDTO,
} from './dto/createSituation.dto';

const prefix = 'situation';

@Controller(prefix)
@ApiTags(tag(prefix))
export class SituationController {
  constructor(
    private readonly service: SituationService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @ApiDefaultOkResponse(null)
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateSituationDTO) {
    await this.service.create(body);
    return this.response.created(res, 'Situation created successfully');
  }

  @Get(['/current'])
  async findCurrent(@Res() res: Response) {
    const data = await this.service.findCurrent();
    return this.response.success(res, 'Situation fetched successfully', data);
  }

  @Get(['/', '/:id'])
  @ApiParam({
    type: 'number',
    name: 'id',
    required: false,
  })
  @ApiQuery({ type: PartialType(FilterSituationDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterSituationDTO }) filters: FilterSituationDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'Situation fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @Auth({ prefix })
  @ApiParam({
    type: 'number',
    name: 'id',
    required: true,
  })
  @ApiDefaultOkResponse(null)
  async delete(@Res() res: Response, @Param('id') id: Id) {
    await this.service.delete(id);
    return this.response.success(res, 'delete Situation successfully');
  }
}
