import { ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from 'src/globals/helpers/password.helpers';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateCustomerDTO } from '../dto/create.customer.dto';

@Injectable()
export class CustomerCreateService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDTO) {
    const { male, ...rest } = data;
    const role = await this.prisma.role.findFirst({
      where: { key: 'Customer' },
    });

    const existingCustomer = await this.prisma.user.findUnique({
      where: {
        phone_roleId: {
          phone: rest.phone,
          roleId: role?.id,
        },
      },
      __includeDeleted: true as never,
    });
    if (existingCustomer.deletedAt !== null) existingCustomer.deletedAt = null;
    if (existingCustomer && existingCustomer.verified)
      throw new ConflictException('customer already exists');

    const hashedPassword = hashPassword(rest.password);
    rest.password = hashedPassword;
    rest['roleId'] = role.id;

    const response =
      existingCustomer && !existingCustomer.verified
        ? existingCustomer
        : await this.prisma.user.create({
            data: {
              ...rest,
              roleId: role.id,
              Details: {
                create: {
                  male,
                  wallet: 0.0,
                },
              },
            },
            select: { email: true, phone: true, id: true, name: true },
          });
    return response;
  }
}
