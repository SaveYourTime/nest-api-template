import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'First task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is my first task.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
