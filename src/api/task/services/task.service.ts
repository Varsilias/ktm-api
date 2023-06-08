import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskRepository } from '../repositories/task.repository';
import { SubtaskService } from 'src/api/subtask/services/subtask.service';
import { DataSource, Repository } from 'typeorm';
import { ColumnEntity } from 'src/api/column/entities/column.entity';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { PostgresError } from 'src/common/helpers/enum';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { GetColumnTasksDto } from '../dto/get-column-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    private readonly _taskRepository: TaskRepository,
    private readonly subtaskService: SubtaskService,
    @InjectRepository(ColumnEntity)
    private readonly _columnRepository: Repository<ColumnEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const column = await this.getColumn(createTaskDto.columnPublicId);

      const entity = this._taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        column,
      });

      const task = await queryRunner.manager.save(entity);

      await queryRunner.commitTransaction();

      const subtasks = createTaskDto.subtasks.map((value: string) => {
        return {
          title: value,
          taskPublicId: task.publicId,
        };
      });

      const result = await this.subtaskService.create(subtasks);

      return { task, subtasks: result };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Unable to create task');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(getColumnTasksDto: GetColumnTasksDto) {
    const column = await this.getColumn(getColumnTasksDto.columnPublicId);
    const tasks = await this._taskRepository.getAllTasksForColumn(column);
    return tasks;
  }

  async findOne(publicId: string) {
    try {
      const task = await this._taskRepository.findOne({
        where: { publicId },
        relations: ['column'],
      });
      if (!task) {
        throw new BadRequestException(`Task does not exist try again.`);
      }
      return task;
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

  async update(publicId: string, updateTaskDto: UpdateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { subtasks, columnPublicId } = updateTaskDto;
      const column = await this.getColumn(columnPublicId);
      const task = await this.findOne(publicId);

      // console.log({
      //   publicId,
      //   updateTaskDto,
      //   column,
      //   task,
      // });

      await this._taskRepository.update(
        { id: task.id },
        {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          column,
        },
      );

      const result = await Promise.all(
        subtasks?.map(async (subtask) => {
          return await this.subtaskService.update({
            title: subtask,
            taskPublicId: task.publicId,
          });
        }),
      );

      await queryRunner.commitTransaction();

      return { task, subtasks: result };
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.log(error);
      throw new BadRequestException('Could not update task');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(publicId: string) {
    try {
      const found = await this.findOne(publicId);
      const result = await this._taskRepository.delete({ id: found.id });

      if (result.affected <= 0) {
        throw new BadRequestException('Unable to delete task');
      }

      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ServerErrorException('Something went wrong');
    }
  }

  private async getColumn(publicId: string) {
    try {
      const column = await this._columnRepository.findOne({
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
}
