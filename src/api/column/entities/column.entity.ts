import { BoardEntity } from 'src/api/board/entities/board.entity';
import { TaskEntity } from 'src/api/task/entities/task.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'columns' })
export class ColumnEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => BoardEntity, (board) => board.columns, {
    onDelete: 'CASCADE',
  })
  board: BoardEntity;

  @OneToMany(() => TaskEntity, (tasks) => tasks.column)
  tasks: TaskEntity[];
}
