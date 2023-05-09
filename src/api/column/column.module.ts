import { Module } from '@nestjs/common';
import { ColumnService } from './services/column.service';
import { ColumnController } from './controllers/column.controller';
import { ColumnRepository } from './repositories/column.repository';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, ColumnRepository],
  exports: [ColumnService],
})
export class ColumnModule {}
