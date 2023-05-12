import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnRepository } from '../repositories/column.repository';
import { BoardEntity } from 'src/api/board/entities/board.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { PostgresError } from 'src/common/helpers/enum';
import { ColumnEntity } from '../entities/column.entity';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';
import { DeleteColumnDto } from '../dto/delete-column.dto';
import { GetBoardColumnsDto } from '../dto/get-board-columns.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ColumnService {
  constructor(
    private readonly columnRepository: ColumnRepository,
    @InjectRepository(BoardEntity)
    private readonly _boardRepository: Repository<BoardEntity>,
  ) {}

  async create(
    createColumnDto: CreateColumnDto | Array<CreateColumnDto>,
    user: IDecoratorUser,
  ) {
    try {
      // if CreateColumnDto is not an Array
      if (!Array.isArray(createColumnDto)) {
        const board = await this.getBoard(createColumnDto.boardPublicId, user);

        const entity = this.columnRepository.create({
          name: createColumnDto.name,
          board: board,
        });

        return await this.columnRepository.save(entity);
      }

      const columns = Promise.all(
        createColumnDto.map(
          async ({ boardPublicId, name }: CreateColumnDto) => {
            const board = await this.getBoard(boardPublicId, user);

            const entity = this.columnRepository.create({
              name: name,
              board: board,
            });
            return await this.columnRepository.save(entity);
          },
        ),
      );
      return columns;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException(
        'Unable to create column, something went wrong',
      );
    }
  }

  async findAll(getBoardColumnsDto: GetBoardColumnsDto, user: IDecoratorUser) {
    const board = await this.getBoard(getBoardColumnsDto.boardPublicId, user);
    return this.columnRepository.getAllColumnsForBoard(board);
  }

  async findOne(publicId: string) {
    try {
      const column = await this.columnRepository.findOne({
        where: { publicId },
        relations: ['board'],
      });
      if (!column) {
        throw new BadRequestException(`Column does not exist try again.`);
      }
      return column;
    } catch (error) {
      if (error.code === PostgresError.INVALID_INPUT_SYNTAX) {
        throw new BadRequestException(
          `Invalid url parameter ${publicId} for publicId`,
        );
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  async update(
    user: IDecoratorUser,
    updateColumnDto: UpdateColumnDto,
    columnPublicId?: string,
  ) {
    try {
      if (!columnPublicId) {
        const column = await this.create(updateColumnDto, user);
        return column;
      }

      const column = await this.findOne(columnPublicId);

      const result = await this.columnRepository.update(
        { id: column.id },
        {
          name: updateColumnDto.name,
        },
      );

      if (result.affected <= 0) {
        throw new BadRequestException('Unable to update column');
      }

      return { message: 'Column updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  async remove(
    publicId: string,
    deletedColumnDto: DeleteColumnDto,
    user: IDecoratorUser,
  ) {
    try {
      const board = await this.getBoard(deletedColumnDto.boardPublicId, user);
      const res = await this.columnRepository.delete({ publicId, board });

      if (!res || res.affected <= 0) {
        throw new BadRequestException('Unable to delete column');
      }
      return { message: 'Column deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  private async getBoard(publicId: string, user: IDecoratorUser) {
    const board = this._boardRepository
      .createQueryBuilder()
      .select('board')
      .from(BoardEntity, 'board')
      .where('board.user = :id', { id: user.id })
      .andWhere('board.publicId = :publicId', { publicId })
      .getOne();

    if (!board) {
      throw new BadRequestException(`Board does not exists`);
    }

    return board;
  }
}
