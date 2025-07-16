import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { UpdateCustomerDTO } from '../dto/create.customer.dto';
import { getCustomerArgs } from '../prisma-args/customer.prisma-args';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { FilterCustomerDTO } from '../dto/filter.customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: FilterCustomerDTO) {
    const args = getCustomerArgs(filters);
    const users = await this.prisma.user[firstOrMany(filters?.id)](args);
    return users;
  }
  async delete(id: Id) {
    await this.prisma.user.delete({ where: { id } });
  }

  async update(id: Id, data: UpdateCustomerDTO) {
    await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async count(filters: FilterCustomerDTO) {
    const args = getCustomerArgs(filters);
    return this.prisma.user.count({ where: args.where });
  }
}
