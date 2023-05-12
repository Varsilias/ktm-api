import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteSubtaskDto {
  @IsString({ message: '"taskPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"taskPublicId" must not be empty' })
  taskPublicId: string;
}
