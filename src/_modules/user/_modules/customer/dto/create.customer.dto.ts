import { PartialType } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
import { ValidateEmail } from 'src/decorators/dto/validators/validate-email.decorator';
import { ValidatePassword } from 'src/decorators/dto/validators/validate-password.decorator';
import { ValidatePhone } from 'src/decorators/dto/validators/validate-phone.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';

export class CreateCustomerDTO {
  @Required()
  @ValidateString()
  name: string;

  @Required()
  @ValidateEmail()
  email: string;

  @Required()
  @ValidatePhone()
  phone: string;

  @Required()
  @ValidatePassword()
  password: string;

  @Required()
  @ValidateBoolean()
  male: boolean;
}

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) {
  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateEmail()
  email?: string;

  @Optional()
  @ValidatePhone()
  phone?: string;

  @Optional()
  @ValidateBoolean()
  male?: boolean;
}
