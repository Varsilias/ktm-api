import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/api/user/entities/user.entity';
import { ColumnEntity } from 'src/api/column/entities/column.entity';

@Entity({ name: 'boards' })
export class BoardEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.boards, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => ColumnEntity, (columns) => columns.board)
  columns: ColumnEntity[];
}
