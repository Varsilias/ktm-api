import { Module } from '@nestjs/common';
import { SubtaskService } from './services/subtask.service';
import { SubtaskController } from './controllers/subtask.controller';

@Module({
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
