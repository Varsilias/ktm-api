import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateSubtaskDto {
  @IsNotEmpty({ message: '"isCompleted" must not be empty' })
  @IsBoolean({ message: '"isCompleted" must be a either true or false' })
  isCompleted?: boolean;

  @IsOptional()
  @IsString({ message: '"title" name must be a string' })
  title: string;

  @IsString({ message: '"taskPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"taskPublicId" must not be empty' })
  taskPublicId: string;
}
