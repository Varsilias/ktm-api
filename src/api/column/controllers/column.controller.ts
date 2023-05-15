import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ColumnService } from '../services/column.service';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';
import { DeleteColumnDto } from '../dto/delete-column.dto';
import { GetBoardColumnsDto } from '../dto/get-board-columns.dto';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';

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
    @Query('boardPublicId') boardPublicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.columnService.findAll({ boardPublicId }, user);
  }

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.columnService.findOne(publicId);
  }

  @Put(':publicId')
  update(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.update(user, updateColumnDto, publicId);
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
