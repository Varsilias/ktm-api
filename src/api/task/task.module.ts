import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { SubtaskModule } from '../subtask/subtask.module';
import { TaskRepository } from './repositories/task.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from '../column/entities/column.entity';

@Module({
  imports: [SubtaskModule, TypeOrmModule.forFeature([ColumnEntity])],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
