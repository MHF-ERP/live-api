import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { CustomerCreateService } from '../services/customer.create.service';
import { CreateCustomerDTO } from '../dto/create.customer.dto';
import { OTPService } from 'src/_modules/authentication/services/otp.service';
import { OTPType } from '@prisma/client';

const prefix = 'customers';
@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ visitor: true, prefix: 'customers/create' })
export class CustomerCreateController {
  constructor(
    private readonly service: CustomerCreateService,
    private readonly OTPService: OTPService,
    private responses: ResponseService,
  ) {}
  @Post('/')
  async createUser(@Res() res: Response, @Body() dto: CreateCustomerDTO) {
    const user = await this.service.create(dto);
    await this.OTPService.generateOTP(user.id, OTPType.EMAIL_VERIFICATION);
    return this.responses.success(res, 'customer created successfully');
  }
}
