import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateEmail } from 'src/decorators/dto/validators/validate-email.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateOTP } from 'src/decorators/dto/validators/validate-otp.decorator';
import { ValidateLoginPassword } from 'src/decorators/dto/validators/validate-password.decorator';
import { ValidatePhone } from 'src/decorators/dto/validators/validate-phone.decorator';
import { EnumArrayFilter } from 'src/decorators/filters/enum.filter.decorator';

class LoginInfoDTO {
  @Optional({ example: 'user' })
  fcm?: string;
}

export class PhoneOTPLoginRequestDTO {
  @ValidatePhone()
  phone: string;
}
export class PhoneOTPLoginDTO extends LoginInfoDTO {
  @ValidatePhone()
  phone: string;

  @ValidateOTP()
  otp: string;
}

export class EmailPasswordLoginDTO extends LoginInfoDTO {
  @Required({ example: 'test@test.com' })
  @ValidateEmail()
  email: string;

  @Required()
  @ValidateLoginPassword()
  password: string;

  @ValidateExist<'role'>({ model: 'role' })
  roleId?: Id;
}

enum RolesCanLoginWithPhone {
  CUSTOMER = 'CUSTOMER',
}
export class RequestOtpDto {
  @ValidatePhone()
  phone: string;

  @EnumArrayFilter(RolesCanLoginWithPhone, 'role', 'Role')
  role?: RolesCanLoginWithPhone;
}
