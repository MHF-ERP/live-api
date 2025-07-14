import { Body, Controller, Get, Patch, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { selectPermissionsOBJ } from 'src/_modules/authorization/prisma-args/permissions.prisma-select';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { Auth } from '../../authentication/decorators/auth.decorator';
import { CurrentUser } from '../../authentication/decorators/current-user.decorator';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../dto/create.user.dto';
import { selectFlattenedUserOBJ } from '../prisma-args/user.prisma-select';
import { UserService } from '../services/user.service';

const prefix = 'profile';
@Controller('users/me')
@ApiTags(tag(prefix))
@Auth({ prefix })
export class MeController {
  constructor(
    private userService: UserService,
    private responses: ResponseService,
  ) {}
  @Get('/permissions')
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Permissions',
        paginated: false,
        body: [selectPermissionsOBJ()],
      },
    ]),
  )
  async getPermissions(
    @Res() res: Response,
    @CurrentUser() currentUser: CurrentUser,
  ) {
    const user = await this.userService.getPermissions(currentUser.id);
    return this.responses.success(
      res,
      'User Permissions returned successfully',
      user,
    );
  }

  @Get('/')
  @ApiOkResponse(
    buildExamples([
      {
        title: 'User Profile',
        paginated: false,
        body: selectFlattenedUserOBJ(),
      },
    ]),
  )
  async Profile(@Res() res: Response, @CurrentUser() currentUser: CurrentUser) {
    const { user, unReadNotifications } = await this.userService.getProfile(
      currentUser.id,
    );
    return this.responses.success(res, 'User returned successfully', {
      user,
      unReadNotifications,
    });
  }
  @Patch('/change-password')
  async updatePassword(
    @Res() res: Response,
    @Body() dto: UpdateUserPasswordDTO,
    @CurrentUser() user: CurrentUser,
  ) {
    await this.userService.updatePassword(user.id, dto);
    return this.responses.success(res, 'user updated successfully');
  }
  @Patch('/')
  @UploadFile('image', 'user')
  async updateCurrentUser(
    @Res() res: Response,
    @Body() dto: UpdateUserDTO,
    @CurrentUser() user: CurrentUser,
  ) {
    await this.userService.updateCurrentUser(dto, user.id, user.jti);
    return this.responses.success(res, 'password updated successfully');
  }
}
