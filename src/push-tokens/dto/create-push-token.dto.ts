import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePushTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}


