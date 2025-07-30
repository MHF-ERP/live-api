import { Required } from 'src/decorators/dto/required-input.decorator';

export class CreatePushTokenDto {
  @Required()
  token: string;
}
