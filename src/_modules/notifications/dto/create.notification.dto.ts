import { Required } from 'src/decorators/dto/required-input.decorator';

export class CreateNotificationDTO {
  @Required()
  token: string;
  @Required()
  title: string;
  @Required()
  body: string;
}
