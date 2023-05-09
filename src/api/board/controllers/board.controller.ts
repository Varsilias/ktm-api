import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(
    @CurrentUser() user: IDecoratorUser,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardService.create(user, createBoardDto);
  }

  @Get()
  async findAll(@CurrentUser() user: IDecoratorUser) {
    return this.boardService.findAll(user);
  }

  @Get(':publicId')
  findOne(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.boardService.findOne(publicId, user);
  }

  @Put(':publicId')
  update(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(publicId, user, updateBoardDto);
  }

  @Delete(':publicId')
  remove(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.boardService.remove(publicId, user);
  }
}
