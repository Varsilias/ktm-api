import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { BoardRepository } from '../repositories/board.repository';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';
import { ColumnService } from 'src/api/column/services/column.service';
import { DataSource } from 'typeorm';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { PostgresError } from 'src/common/helpers/enum';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly columnService: ColumnService,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: IDecoratorUser, createBoardDto: CreateBoardDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { columns } = createBoardDto;
      const entity = this.boardRepository.create({
        name: createBoardDto.name,
        user,
      });

      const board = await queryRunner.manager.save(entity);

      const result = await Promise.all(
        columns.map(async (column: string) => {
          return await this.columnService.create(
            { name: column },
            board,
            queryRunner,
          );
        }),
      );

      board.columns = result;

      await queryRunner.commitTransaction();

      return board;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Could not create board');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(user: IDecoratorUser) {
    return this.boardRepository.getAllBoardsForUser(user);
  }

  async findOne(publicId: string, user: IDecoratorUser) {
    try {
      const board = await this.boardRepository.getOne(publicId, user);
      if (!board) {
        throw new BadRequestException(`Board does not exist try again.`);
      }
      return board;
    } catch (error) {
      // console.log('Errrrrooooorrr - %o', error);
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
    publicId: string,
    user: IDecoratorUser,
    updateBoardDto: UpdateBoardDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { columns } = updateBoardDto;
      const board = await this.findOne(publicId, user);

      await this.boardRepository.update(
        { id: board.id, user },
        { name: updateBoardDto.name },
      );

      const result = await Promise.all(
        columns.map(async (column) => {
          return await this.columnService.update(
            board,
            { name: column },
            queryRunner,
          );
        }),
      );

      await queryRunner.commitTransaction();

      console.log('Result - %o', { board, result });
      return board;
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Could not update board');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(publicId: string, user: IDecoratorUser) {
    try {
      const found = await this.findOne(publicId, user);
      await this.boardRepository.delete({ publicId });

      return found;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServerErrorException('Something went wrong');
    }
  }
}
