import { PartialType } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateObject } from 'src/decorators/dto/validators/validate-nested.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class Option {
  @Required()
  @ValidateString()
  title: string;
}
export class CreateSituationDTO {
  @Required()
  @ValidateDate()
  date: Date;

  @Required()
  @ValidateString()
  title: string;

  @Optional()
  @ValidateString()
  description?: string;

  @Required()
  @ValidateNumber()
  dayId?: Id;

  @Required({ type: Option, isArray: true })
  @ValidateObject(Option, true)
  options: Option[];
}
export class UpdateSituationDTO extends PartialType(CreateSituationDTO) {
  @Optional()
  @ValidateNumber()
  id?: Id;
}
export class FilterSituationDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateNumber()
  dayId?: Id;
}
