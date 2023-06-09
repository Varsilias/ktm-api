import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BoardEntity } from 'src/api/board/entities/board.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ length: 16, nullable: true })
  @Exclude()
  securityToken: string;

  // When the user registered / requested email change
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  @Exclude()
  securityTokenRequestedAt: Date;

  @OneToMany(() => BoardEntity, (boards) => boards.user)
  boards: BoardEntity[];
}
