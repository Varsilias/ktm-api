import { Module } from '@nestjs/common';
import { BoardService } from './services/board.service';
import { BoardController } from './controllers/board.controller';
import { BoardRepository } from './repositories/board.repository';
import { ColumnModule } from '../column/column.module';

@Module({
  imports: [ColumnModule],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
})
export class BoardModule {}
