import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ColumnEntity } from '../entities/column.entity';
import { BoardEntity } from 'src/api/board/entities/board.entity';

@Injectable()
export class ColumnRepository extends Repository<ColumnEntity> {
  constructor(private datasource: DataSource) {
    super(ColumnEntity, datasource.createEntityManager());
  }

  async getAllColumnsForBoard(board: BoardEntity) {
    return this.createQueryBuilder()
      .select('column')
      .from(ColumnEntity, 'column')
      .where('column.board = :id', { id: board.id })
      .getMany();
  }

  async getOne(publicId: string, board: BoardEntity) {
    return this.createQueryBuilder()
      .select('column')
      .from(ColumnEntity, 'column')
      .leftJoinAndSelect('column.board', 'board')
      .where('column.board = :id', { id: board.id })
      .andWhere('column.publicId = :publicId', { publicId })
      .getOne();
  }
}
