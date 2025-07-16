import { Module } from '@nestjs/common';
import { CustomerCreateController } from './controllers/customer.create.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerCreateService } from './services/customer.create.service';

@Module({
  imports: [],
  controllers: [CustomerCreateController, CustomerController],
  providers: [CustomerService, CustomerCreateService],
  exports: [],
})
export class CustomerModule {}
