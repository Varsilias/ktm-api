import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString({ message: 'Board name must be a string' })
  @IsNotEmpty({ message: 'Please provide a name for the board' })
  name: string;

  @IsNotEmpty()
  @IsArray({ message: 'Columns must be a list of strings' })
  @ArrayNotEmpty({ message: 'Column name list must contain at least 2 items' })
  columns: Array<string>;
}
