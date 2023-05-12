import { TaskEntity } from 'src/api/task/entities/task.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'subtasks' })
export class SubtaskEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => TaskEntity, (task) => task.subtasks, { onDelete: 'CASCADE' })
  task: TaskEntity;
}
