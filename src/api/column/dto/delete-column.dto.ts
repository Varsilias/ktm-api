import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteColumnDto {
  @IsNotEmpty({ message: 'Board public id must not be empty' })
  @IsUUID('4')
  @IsString({ message: 'Board public id must be a string' })
  boardPublicId: string;
}
