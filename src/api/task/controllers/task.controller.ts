import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetColumnTasksDto } from '../dto/get-column-tasks.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@Body() getColumnTasksDto: GetColumnTasksDto) {
    return this.taskService.findAll(getColumnTasksDto);
  }

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.taskService.findOne(publicId);
  }

  @Patch(':publicId')
  update(
    @Param('publicId') publicId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(publicId, updateTaskDto);
  }

  @Delete(':publicId')
  remove(@Param('publicId') publicId: string) {
    return this.taskService.remove(publicId);
  }
}
