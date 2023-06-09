import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteColumnDto {
  @IsString({ message: '"boardPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"boardPublicId" must not be empty' })
  boardPublicId: string;
}
