import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SubtaskService } from '../services/subtask.service';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { DeleteSubtaskDto } from '../dto/delete-subtask.dto';

@Controller('subtasks')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Post()
  create(@Body() createSubtaskDto: CreateSubtaskDto) {
    return this.subtaskService.create(createSubtaskDto);
  }

  @Get()
  findAll(@Query('taskPublicId') taskPublicId: string) {
    return this.subtaskService.findAll({ taskPublicId });
  }

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.subtaskService.findOne(publicId);
  }

  @Put(':publicId')
  update(
    @Param('publicId') publicId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtaskService.update(updateSubtaskDto, publicId);
  }

  @Delete(':publicId')
  remove(
    @Param('publicId') publicId: string,
    @Body() deleteSubtaskDto: DeleteSubtaskDto,
  ) {
    return this.subtaskService.remove(publicId, deleteSubtaskDto);
  }
}
