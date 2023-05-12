import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SubtaskEntity } from '../entities/subtask.entity';
import { TaskEntity } from 'src/api/task/entities/task.entity';

@Injectable()
export class SubtaskRepository extends Repository<SubtaskEntity> {
  constructor(private datasource: DataSource) {
    super(SubtaskEntity, datasource.createEntityManager());
  }

  async getAllSubtaskForTask(task: TaskEntity) {
    return this.createQueryBuilder()
      .select('subtask')
      .from(SubtaskEntity, 'subtask')
      .where('subtask.task = :id', { id: task.id })
      .getMany();
  }

  async getOne(publicId: string, task: TaskEntity) {
    return this.createQueryBuilder()
      .select('subtask')
      .from(SubtaskEntity, 'subtask')
      .leftJoinAndSelect('subtask.task', 'task')
      .where('subtask.task = :id', { id: task.id })
      .andWhere('subtask.publicId = :publicId', { publicId })
      .getOne();
  }
}
