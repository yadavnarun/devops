import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    nullable: false,
    description: 'The action name',
    example: 'new action',
  })
  action: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    nullable: false,
    description: 'The action content',
    example: 'new action content',
  })
  content: string;
}
