import { Module } from '@nestjs/common';
import { SubtaskService } from './services/subtask.service';
import { SubtaskController } from './controllers/subtask.controller';
import { SubtaskRepository } from './repositories/subtask.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [SubtaskController],
  providers: [SubtaskService, SubtaskRepository],
  exports: [SubtaskService],
})
export class SubtaskModule {}
