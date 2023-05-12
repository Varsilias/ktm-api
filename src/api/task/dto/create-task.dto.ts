import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: '"title" must be a string' })
  @IsNotEmpty({ message: 'Please provide a title for the task' })
  title: string;

  @IsOptional()
  @IsString({ message: '"description" must be a string' })
  description?: string;

  @IsNotEmpty()
  @IsArray({ message: '"Subtasks" must be a list of strings' })
  @ArrayNotEmpty({
    message: '"Subtasks" name list must contain at least 2 items',
  })
  subtasks: Array<string>;

  @IsString({ message: '"columnPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"columnPublicId" must not be empty' })
  columnPublicId: string;
}
