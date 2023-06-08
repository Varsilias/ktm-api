import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: '"title" must be a string' })
  @IsNotEmpty({ message: 'Please provide a title for the task' })
  title?: string;

  @IsOptional()
  @IsString({ message: '"description" must be a string' })
  description?: string;

  @IsOptional()
  @IsArray({ message: '"Subtasks" must be a list of strings' })
  subtasks: Array<string>;

  @IsString({ message: '"columnPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"columnPublicId" must not be empty' })
  columnPublicId: string;
}
