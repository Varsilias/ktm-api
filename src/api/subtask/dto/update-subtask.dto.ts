import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateSubtaskDto } from './create-subtask.dto';

export class UpdateSubtaskDto extends CreateSubtaskDto {
  @IsNotEmpty({ message: '"isCompleted" must not be empty' })
  @IsBoolean({ message: '"isCompletd" must be a either true or false' })
  isCompleted?: boolean;
}
