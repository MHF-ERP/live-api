import { Controller, Post, Body, Get } from '@nestjs/common';
import { PushTokensService } from './push-tokens.service';
import { CreatePushTokenDto } from './dto/create-push-token.dto';

@Controller("push-tokens")
export class PushTokensController {
  constructor(private readonly pushTokensService: PushTokensService) {}

  @Post()
  create(@Body() createPushTokenDto: CreatePushTokenDto) {
    return this.pushTokensService.create(createPushTokenDto);
  }

  @Get()
  findAll() {
    return this.pushTokensService.findAll();
  }
}


