import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiOptionalIdParam,
  ApiRequiredIdParam,
} from 'src/decorators/api/id-params.decorator';
import { OptionalIdParam, RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { Auth } from '../../authentication/decorators/auth.decorator';
import { CreateRoleDTO, UpdateRoleDTO } from '../dto/role.dto';
import {
  selectAllRolesOBJ,
  selectRoleOBJ,
} from '../prisma-args/role.prisma-select';
import { RoleService } from '../services/roles.service';

const prefix = 'roles';
@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class RoleController {
  constructor(
    private readonly service: RoleService,
    private readonly responses: ResponseService,
  ) {}

  @Get(['/', '/:id'])
  @ApiOptionalIdParam()
  @ApiOkResponse(
    buildExamples([
      {
        title: 'All Roles',
        paginated: false,
        body: [selectAllRolesOBJ()],
      },
      {
        title: 'Role with Id',
        paginated: false,
        body: [selectRoleOBJ()],
      },
    ]),
  )
  async get(@Res() res: Response, @Param() { id }: OptionalIdParam) {
    const roles = await this.service.getRoles(id);
    return this.responses.success(res, 'Roles retrieved successfully', roles);
  }

  @Patch('/:id')
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() dto: UpdateRoleDTO,
  ) {
    await this.service.update(id, dto);
    return this.responses.success(res, 'Role updated successfully');
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.responses.success(res, 'Role deleted successfully');
  }

  @Post('/')
  async post(@Res() res: Response, @Body() dto: CreateRoleDTO) {
    await this.service.post(dto);
    return this.responses.created(res, 'Create role successfully');
  }
}
