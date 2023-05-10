import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class GetBoardColumnsDto {
  @IsString({ message: '"boardPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"boardPublicId" must not be empty' })
  boardPublicId: string;
}
