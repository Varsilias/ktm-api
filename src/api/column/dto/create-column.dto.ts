import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString({ message: 'Column name must be a string' })
  @IsNotEmpty({ message: 'Column name must not be empty' })
  name: string;
}
