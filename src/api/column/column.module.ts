import { Module } from '@nestjs/common';
import { ColumnService } from './services/column.service';
import { ColumnController } from './controllers/column.controller';
import { ColumnRepository } from './repositories/column.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from '../board/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity])],
  controllers: [ColumnController],
  providers: [ColumnService, ColumnRepository],
  exports: [ColumnService],
})
export class ColumnModule {}
