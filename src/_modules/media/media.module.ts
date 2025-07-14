import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './services/media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [],
})
export class MediaModule {}
