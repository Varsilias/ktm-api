import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { SubtaskModule } from './subtask/subtask.module';

@Module({
  imports: [AuthModule, UserModule, BoardModule, ColumnModule, TaskModule, SubtaskModule],
})
export class ApiModule {}
