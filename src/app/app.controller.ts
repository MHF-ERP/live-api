import { Controller } from '@nestjs/common';
import { ResponseService } from 'src/globals/services/response.service';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly response: ResponseService,
    private readonly service: AppService,
  ) {}

  // @Get('/debug-sentry')
  // getError() {
  //   throw new Error('My first Sentry error!');
  // }
  // @Get('/roles-show')
  // @ApiOperation({ deprecated: true })
  // async rolesShow(@Res() res: Response) {
  //   const data = await this.service.getAllRoles();
  //   return this.response.success(res, 'Roles returned successfully', data);
  // }
}
