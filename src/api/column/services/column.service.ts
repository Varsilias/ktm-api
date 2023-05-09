import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnRepository } from '../repositories/column.repository';
import { BoardEntity } from 'src/api/board/entities/board.entity';
import { QueryRunner } from 'typeorm';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { PostgresError } from 'src/common/helpers/enum';
import { ColumnEntity } from '../entities/column.entity';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';
import { DeleteColumnDto } from '../dto/delete-column.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly columnRepository: ColumnRepository) {}

  async create(
    createColumnDto: CreateColumnDto,
    board: BoardEntity,
    queryRunner: QueryRunner,
  ) {
    const entity = this.columnRepository.create({
      name: createColumnDto.name,
      board: board,
    });
    return queryRunner.manager.save(entity);
  }

  findAll() {
    return `This action returns all column`;
  }

  async findOne(publicId: string, board: BoardEntity) {
    try {
      const column = await this.columnRepository.getOne(publicId, board);
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
    board: BoardEntity,
    updateColumnDto: UpdateColumnDto,
    queryRunner: QueryRunner,
  ) {
    try {
      let column: ColumnEntity;

      column = await this.columnRepository.findOne({
        where: { name: updateColumnDto.name, board: board },
      });

      if (!column) {
        console.log(
          `Column ${updateColumnDto.name} not found, creating new record`,
        );
        column = await this.create(updateColumnDto, board, queryRunner);
        return column;
      }

      console.log(`Column ${updateColumnDto.name} found, updating record`);

      const updatedColumn = await this.columnRepository.update(
        { id: column.id, board: board },
        { name: updateColumnDto.name },
      );

      return updatedColumn;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  async remove(
    publicId: string,
    user: IDecoratorUser,
    deletedColumnDto: DeleteColumnDto,
  ) {
    try {
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }
}
