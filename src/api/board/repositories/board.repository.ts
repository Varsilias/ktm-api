import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BoardEntity } from '../entities/board.entity';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class BoardRepository extends Repository<BoardEntity> {
  constructor(private datasource: DataSource) {
    super(BoardEntity, datasource.createEntityManager());
  }

  async getAllBoardsForUser(user: IDecoratorUser) {
    return this.createQueryBuilder()
      .select('board')
      .from(BoardEntity, 'board')
      .where('board.user = :id', { id: user.id })
      .getMany();
  }

  async getOne(publicId: string, user: IDecoratorUser) {
    return this.createQueryBuilder()
      .select('board')
      .from(BoardEntity, 'board')
      .leftJoinAndSelect('board.columns', 'columns')
      .where('board.user = :id', { id: user.id })
      .andWhere('board.publicId = :publicId', { publicId })
      .getOne();
  }
}
