import { Controller, Get, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Filter } from 'src/decorators/param/filter.decorator';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { FilterSearchDTO } from '../dto/search.dto';
import { SearchService } from '../services/search.service';

const prefix = 'search';
@Controller(prefix)
@ApiTags(tag(prefix))
// @Auth({vis})
export class SearchController {
  constructor(
    private service: SearchService,
    private response: ResponseService,
  ) {}

  @Get('/')
  @ApiQuery({ type: FilterSearchDTO })
  async search(
    @Res() res: Response,
    @Filter({ dto: FilterSearchDTO }) filters: FilterSearchDTO,
  ) {
    const data = await this.service.search(filters);
    return this.response.success(res, 'search processed successfully', data);
  }

  @Get('/allowedModels')
  async getAllowedModels(@Res() res: Response) {
    const data = this.service.getAllowedModels();
    return this.response.success(
      res,
      'return allowed models successfully',
      data,
    );
  }
}
