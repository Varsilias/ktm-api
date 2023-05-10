import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnService } from '../services/column.service';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';
import { DeleteColumnDto } from '../dto/delete-column.dto';
import { GetBoardColumnsDto } from '../dto/get-board-columns.dto';
import { CreateColumnDto } from '../dto/create-column.dto';
// import { UpdateColumnDto } from '../dto/update-column.dto';

@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  create(
    @Body() createColumnDto: CreateColumnDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.columnService.create(createColumnDto, user);
  }

  @Get()
  findAll(
    @Body() getBoardColumnsDto: GetBoardColumnsDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.columnService.findAll(getBoardColumnsDto, user);
  }

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.columnService.findOne(publicId);
  }

  @Delete(':publicId')
  remove(
    @Param('publicId') publicId: string,
    @Body() deletedColumnDto: DeleteColumnDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.columnService.remove(publicId, deletedColumnDto, user);
  }
}
