import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../globals/services/prisma.service';

import { OTPType, SessionType } from '@prisma/client';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { hashPassword } from 'src/globals/helpers/password.helpers';
import { VerifyResetOtpDTO } from '../../authentication/dto/reset-password.dto';
import { TokenService } from '../../authentication/services/jwt.service';
import { OTPService } from '../../authentication/services/otp.service';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UpdateUserPasswordDTO,
} from '../dto/create.user.dto';
import { FilterUserDTO } from '../dto/filter.user.dto';
import { getUserArgs } from '../prisma-args/user.prisma-ags';
import {
  FlattenedUser,
  selectUserWithRoleAndPermissionsOBJ,
  transformFlattenUser,
} from '../prisma-args/user.prisma-select';
import { HelperService } from './helper.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private Token: TokenService,
    private OTP: OTPService,
    private helper: HelperService,
  ) {}

  async getUser(userId: Id) {
    const selectObj = selectUserWithRoleAndPermissionsOBJ();
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: selectObj,
    });
    const flattenUser = transformFlattenUser(user);
    return flattenUser;
  }

  async getAll(filters: FilterUserDTO) {
    const args = getUserArgs(filters);
    const users = await this.prisma.user[firstOrMany(filters.id)](args);
    return users;
  }
  async getFcmToken(jti: string) {
    const session = await this.prisma.session.findUnique({
      where: { jti },
      select: { fcmToken: true },
    });

    return session?.fcmToken;
  }
  async count(filters: FilterUserDTO) {
    const args = getUserArgs(filters);
    return this.prisma.user.count({ where: args.where });
  }

  async delete(id: Id) {
    await this.prisma.user.delete({ where: { id } });
  }

  async verify(userId: Id, data: VerifyResetOtpDTO) {
    await this.OTP.verifyOTP(userId, data.otp, OTPType.EMAIL_VERIFICATION);
    await this.prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });
    const user = await this.getProfile(userId);
    const token = await this.Token.generateToken(
      user?.user?.id,
      undefined,
      SessionType.ACCESS,
    );
    return { user, token };
  }

  async create(data: CreateUserDTO) {
    await this.helper.userExistOrThrow({
      email: data.email,
      roleId: data.roleId,
    });

    const hashedPassword = hashPassword(data.password);
    data.password = hashedPassword;
    await this.prisma.user.create({
      data,
      select: { email: true, phone: true, id: true, name: true },
    });
  }

  async updateCurrentUser(dto: UpdateUserDTO, userId: Id, jti: string) {
    const { fcm, ...data } = dto;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (fcm) {
      await this.prisma.session.update({
        where: {
          jti,
        },
        data: {
          fcmToken: fcm,
        },
      });
    }
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
  }

  async updatePassword(id: Id, data: UpdateUserPasswordDTO) {
    const { password, newPassword } = data;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user.password !== hashPassword(password)) {
      throw new BadRequestException('INVALID_CREDENTIALS');
    }
    const hashedPassword = hashPassword(newPassword);
    this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
    await this.prisma.session.deleteMany({
      where: { userId: id },
    });
  }

  async getProfile(id) {
    const user = await this.getUser(id);
    const unReadNotifications = await this.prisma.notification.count({
      where: {
        userId: id,
        read: false,
      },
    });

    return { user, unReadNotifications };
  }

  async getPermissions(id: Id) {
    const user: FlattenedUser = await this.getUser(id);
    return user.Permissions;
  }

  async update(id: Id, data: UpdateUserDTO) {
    await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateLocale(jti: string, locale: string) {
    await this.prisma.session.update({
      where: { jti },
      data: { languageId: locale },
    });
  }
}
