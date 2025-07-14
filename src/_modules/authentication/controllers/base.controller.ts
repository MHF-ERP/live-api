import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SessionType } from '@prisma/client';
import { Response } from 'express';
import { CurrentUser } from 'src/_modules/authentication/decorators/current-user.decorator';
import { cookieConfig } from 'src/configs/cookie.config';
import { ApiDefaultOkResponse } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { Auth } from '../decorators/auth.decorator';
import { IpAddress } from '../decorators/ip.decorator';
import { ForgetPasswordDTO } from '../dto/forgot-password.dto';
import { EmailPasswordLoginDTO } from '../dto/login.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { VerifyOtpDTO } from '../dto/verify-otp.dto';
import { BaseAuthenticationService } from '../services/base.authentication.service';

const prefix = 'authentication';
@Controller(prefix)
@ApiTags(tag(prefix))
export class BaseAuthenticationController {
  constructor(
    private readonly service: BaseAuthenticationService,
    private readonly response: ResponseService,
  ) {}

  @Post('refresh-token')
  @ApiDefaultOkResponse(null)
  @Auth({ type: SessionType.REFRESH })
  async refreshToken(
    @IpAddress() ip: string,
    @Res() res: Response,
    @CurrentUser('id') userId: Id,
  ) {
    const { user, AccessToken } = await this.service.refreshToken(ip, userId);

    res.cookie(env('ACCESS_TOKEN_COOKIE_KEY'), AccessToken, cookieConfig);

    return this.response.success(res, 'Access token refreshed successfully', {
      user,
      AccessToken,
    });
  }

  @Post('login/:roleId')
  @ApiParam({
    name: 'roleId',
    type: 'number',
    required: true,
  })
  async login(
    @IpAddress() ip: string,
    @Res() res: Response,
    @Body() dto: EmailPasswordLoginDTO,
  ) {
    const { user, AccessToken, RefreshToken, unReadNotifications } =
      await this.service.login(ip, dto);

    res.cookie(env('ACCESS_TOKEN_COOKIE_KEY'), AccessToken, cookieConfig);

    return this.response.success(res, 'User Logged In Successfully', {
      user,
      unReadNotifications,
      AccessToken,
      RefreshToken,
    });
  }

  @Post('forget-password/:roleId')
  @ApiParam({
    name: 'roleId',
    type: 'number',
    required: true,
  })
  async forgetPassword(
    @IpAddress() ip: string,
    @Res() res: Response,
    @Body() dto: ForgetPasswordDTO,
  ) {
    const { user, token } = await this.service.forgetPassword(ip, dto);

    res.cookie(env('VERIFY_TOKEN_COOKIE_KEY'), token, cookieConfig);

    return this.response.success(res, 'otp sent to email successfully', {
      user,
      token,
    });
  }

  @Post('verify')
  @Auth({ type: SessionType.VERIFY })
  async verifyUser(
    @IpAddress() ip: string,
    @Res() res: Response,
    @Body() dto: VerifyOtpDTO,
    @CurrentUser() currentUser: CurrentUser,
  ) {
    const { data, AccessToken, RefreshToken } = await this.service.verify(
      ip,
      currentUser.id,
      dto,
    );

    res.cookie(env('ACCESS_TOKEN_COOKIE_KEY'), AccessToken, cookieConfig);

    return this.response.success(res, 'user verified successfully', {
      user: data,
      AccessToken,
      RefreshToken,
    });
  }

  @Post('verify-reset-password')
  @Auth({ type: SessionType.VERIFY })
  async verifyOtp(
    @Res() res: Response,
    @Body() dto: VerifyOtpDTO,
    @CurrentUser() currentUser: CurrentUser,
  ) {
    const { user, token } = await this.service.verifyReset(currentUser.id, dto);

    res.cookie(env('RESET_PASSWORD_TOKEN_COOKIE_KEY'), token, cookieConfig);

    return this.response.success(res, 'user verified successfully', {
      user,
      token,
    });
  }

  @Post('reset-password')
  @Auth({ type: SessionType.PASSWORD_RESET })
  async resetPassword(
    @Res() res: Response,
    @Body() dto: ResetPasswordDTO,
    @CurrentUser('id') userId: Id,
  ) {
    await this.service.resetPassword(userId, dto);

    return this.response.success(res, 'password reset successfully');
  }

  @Post('logout')
  @Auth()
  async logout(@Res() res: Response, @CurrentUser() { jti }: CurrentUser) {
    await this.service.logout(jti);
    return this.response.success(res, 'User Logged Out');
  }
}
