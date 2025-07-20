import { Module } from '@nestjs/common';
import { CustomerCreateController } from './controllers/customer.create.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerCreateService } from './services/customer.create.service';
import { OTPService } from 'src/_modules/authentication/services/otp.service';

@Module({
  imports: [],
  controllers: [CustomerCreateController, CustomerController],
  providers: [CustomerService, CustomerCreateService, OTPService],
  exports: [],
})
export class CustomerModule {}
