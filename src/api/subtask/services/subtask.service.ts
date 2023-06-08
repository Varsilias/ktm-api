import { Injectable } from '@nestjs/common';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { SubtaskRepository } from '../repositories/subtask.repository';
import { Repository } from 'typeorm';
import { TaskEntity } from 'src/api/task/entities/task.entity';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { PostgresError } from 'src/common/helpers/enum';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { DeleteSubtaskDto } from '../dto/delete-subtask.dto';
import { GetSubtasksDto } from '../dto/get-subtask.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubtaskService {
  constructor(
    private readonly subtaskRepository: SubtaskRepository,
    @InjectRepository(TaskEntity)
    private readonly _taskRepository: Repository<TaskEntity>,
  ) {}
  async create(createSubtaskDto: CreateSubtaskDto | Array<CreateSubtaskDto>) {
    try {
      // if CreateSubtaskDto is not an Array
      if (!Array.isArray(createSubtaskDto)) {
        const task = await this.getTask(createSubtaskDto.taskPublicId);

        const entity = this.subtaskRepository.create({
          title: createSubtaskDto.title,
          task,
        });

        return await this.subtaskRepository.save(entity);
      }

      const subtasks = Promise.all(
        createSubtaskDto.map(
          async ({ taskPublicId, title }: CreateSubtaskDto) => {
            const task = await this.getTask(taskPublicId);

            const entity = this.subtaskRepository.create({
              title,
              task,
            });
            return await this.subtaskRepository.save(entity);
          },
        ),
      );
      return subtasks;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException(
        'Unable to create subtasks, something went wrong',
      );
    }
  }

  async findAll(getSubtasksDto: GetSubtasksDto) {
    const task = await this.getTask(getSubtasksDto.taskPublicId);
    const subtasks = await this.subtaskRepository.getAllSubtaskForTask(task);
    return subtasks;
  }

  async findOne(publicId: string) {
    try {
      const subtask = await this.subtaskRepository.findOne({
        where: { publicId },
        relations: ['task'],
      });
      if (!subtask) {
        throw new BadRequestException(`Subtask does not exist try again.`);
      }
      return subtask;
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

  async update(updateSubtaskDto: UpdateSubtaskDto, subtaskPublicId?: string) {
    try {
      if (!subtaskPublicId) {
        const subtask = await this.create(updateSubtaskDto);
        return subtask;
      }

      const subtask = await this.findOne(subtaskPublicId);
      const result = await this.subtaskRepository.update(
        { id: subtask.id },
        {
          title: updateSubtaskDto.title,
          isCompleted: updateSubtaskDto.isCompleted,
        },
      );

      if (result.affected <= 0) {
        throw new BadRequestException('Unable to update subtask status');
      }

      return { message: 'Subtask updated successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  async remove(publicId: string, deleteSubtaskDto: DeleteSubtaskDto) {
    try {
      const task = await this.getTask(deleteSubtaskDto.taskPublicId);
      const res = await this.subtaskRepository.delete({ publicId, task });

      if (!res || res.affected <= 0) {
        throw new BadRequestException('Unable to delete subtask');
      }
      return { message: 'Subtask deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong');
    }
  }

  private async getTask(publicId: string) {
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
}
