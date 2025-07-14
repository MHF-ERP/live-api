import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SessionType, User } from '@prisma/client';
import { TokenService } from 'src/_modules/authentication/services/jwt.service';
import { validateUserPassword } from 'src/globals/helpers/password.helpers';

import { PrismaService } from 'src/globals/services/prisma.service';

@Injectable()
export class HelperService {
  constructor(
    private prisma: PrismaService,
    private Token: TokenService,
  ) {}

  async getUserById(id: Id) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) throw new UnprocessableEntityException('user_not_found');
    delete user.password;
    return user;
  }

  async userExist({
    message,
    id,
    email,
    password,
    roleId,
  }: {
    message?: string;
    id?: Id;
    email?: string;
    password?: string;
    roleId?: Id;
  }): Promise<User> {
    message = message ?? 'user_not_found';
    const isFound = await this.prisma.user.findFirst({
      where: {
        id,
        email,
        roleId,
        deletedAt: null,
      },
    });

    if (!isFound) throw new UnprocessableEntityException(message);

    if (password) validateUserPassword(password, isFound.password);

    await this.userCanLogin(isFound);

    delete isFound.password;
    return isFound;
  }

  async userExistOrThrow({
    id,
    email,
    phone,
    roleId,
  }: {
    id?: Id;
    email?: string;
    phone?: string;
    roleId?: number;
  }) {
    const isFound = await this.prisma.user.findFirst({
      where: {
        id,
        OR: [{ email }, { phone }],
        roleId,
        deletedAt: null,
      },
    });

    if (isFound) throw new ConflictException('user_already_exist');
  }

  async userCanLogin(user: User) {
    if (!user) {
      throw new UnprocessableEntityException('invalid credentials');
    }
    if (!user.verified) {
      const token = await this.Token.generateToken(
        user.id,
        undefined,
        SessionType.VERIFY,
      );
      throw new PreconditionFailedException('NOT_VERIFIED', {
        ...({
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            },
            token,
          },
        } as any),
      });
    }
    if (!user.active) {
      throw new UnprocessableEntityException('DISABLED_ACCOUNT');
    }
  }
}
