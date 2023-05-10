import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { SubtaskModule } from './subtask/subtask.module';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [AuthModule, UserModule, BoardModule, TaskModule, SubtaskModule, ColumnModule],
})
export class ApiModule {}
