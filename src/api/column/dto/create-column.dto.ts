import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsString({ message: 'Column name must be a string' })
  @IsNotEmpty({ message: 'Column name must not be empty' })
  name: string;

  @IsString({ message: '"boardPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"boardPublicId" must not be empty' })
  boardPublicId: string;
}
