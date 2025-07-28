import { Module } from '@nestjs/common';
import { SituationController } from './situation.controller';
import { SituationService } from './situation.service';

@Module({
  imports: [],
  controllers: [SituationController],
  providers: [SituationService],
})
export class SituationModule {}
