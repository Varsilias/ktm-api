import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubtaskDto {
  @IsString({ message: '"title" name must be a string' })
  @IsNotEmpty({ message: '"title" name must not be empty' })
  title: string;

  @IsString({ message: '"taskPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"taskPublicId" must not be empty' })
  taskPublicId: string;
}
