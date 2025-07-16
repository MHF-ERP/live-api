import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class FilterCustomerDTO extends PartialType(PaginationParamsDTO) {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateString()
  email?: string;

  @Optional()
  @ValidateString()
  phone?: string;
}
