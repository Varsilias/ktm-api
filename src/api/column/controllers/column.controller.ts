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
// import { CreateColumnDto } from '../dto/create-column.dto';
// import { UpdateColumnDto } from '../dto/update-column.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // @Post()
  // create(@Body() createColumnDto: CreateColumnDto) {
  //   return this.columnService.create(createColumnDto);
  // }

  @Get()
  findAll(@CurrentUser() user: IDecoratorUser) {
    return this.columnService.findAll();
  }

  // @Get(':publicId')
  // findOne(@Param('publicId') id: string) {
  //   return this.columnService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
  //   return this.columnService.update(+id, updateColumnDto);
  // }

  @Delete(':publicId')
  remove(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
    @Body() deletedColumnDto: DeleteColumnDto,
  ) {
    return this.columnService.remove(publicId, user, deletedColumnDto);
  }
}
