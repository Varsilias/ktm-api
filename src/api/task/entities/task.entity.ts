import { ColumnEntity } from 'src/api/column/entities/column.entity';
import { SubtaskEntity } from 'src/api/subtask/entities/subtask.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => ColumnEntity, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  column: ColumnEntity;

  @OneToMany(() => SubtaskEntity, (subtasks) => subtasks.task)
  subtasks: SubtaskEntity[];
}
