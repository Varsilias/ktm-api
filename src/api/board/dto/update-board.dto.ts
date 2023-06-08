import { IsString, IsOptional, IsArray } from 'class-validator';
export class UpdateBoardDto {
  @IsString({ message: 'Board name must be a string' })
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Columns must be a list of strings' })
  columns?: Array<string>;
}
