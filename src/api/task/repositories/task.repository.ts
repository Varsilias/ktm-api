import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { ColumnEntity } from 'src/api/column/entities/column.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private datasource: DataSource) {
    super(TaskEntity, datasource.createEntityManager());
  }

  async getAllTasksForColumn(column: ColumnEntity) {
    return this.createQueryBuilder()
      .select('task')
      .from(TaskEntity, 'task')
      .where('task.column = :id', { id: column.id })
      .getMany();
  }
}
