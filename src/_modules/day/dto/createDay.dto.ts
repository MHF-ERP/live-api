import { PartialType } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class CreateDayDTO {
  @Required()
  @ValidateDate()
  date: Date;

  @Required()
  @ValidateDate()
  expiredDate: Date;

  @Required()
  @ValidateString()
  title: string;

  @Required()
  @ValidateString()
  description: string;
}
export class UpdateDayDTO extends PartialType(CreateDayDTO) {
  @Optional()
  @ValidateNumber()
  id?: Id;
}
export class FilterDayDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;
}
