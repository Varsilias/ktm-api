import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
export class UpdateBoardDto {
  @IsString({ message: 'Board name must be a string' })
  @IsNotEmpty({ message: 'Please provide a name for the board' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'Columns must be a list of strings' })
  columns?: Array<string>;
}
