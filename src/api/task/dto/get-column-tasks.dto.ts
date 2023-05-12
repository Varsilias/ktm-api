import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class GetColumnTasksDto {
  @IsString({ message: '"columnPublicId" must not be empty' })
  @IsUUID()
  @IsNotEmpty({ message: '"columnPublicId" must not be empty' })
  columnPublicId: string;
}
