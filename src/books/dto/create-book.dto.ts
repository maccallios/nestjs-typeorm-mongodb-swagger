import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator'

export class CreateBookDto {
  @IsString()
  @ApiProperty({
    example: "6291eecef5bc45db818395a4"
  })
  _id: string;

  @IsString()
  @ApiProperty({
    example: "Henrik Ibsen"
  })
  author: string;

  @IsString()
  @ApiProperty({
    example: "Norway"
  })
  country: string;

  @IsString()
  @ApiProperty({
    example: "images/a-Dolls-house.jpg"
  })
  imageLink: string;

  @IsString()
  @ApiProperty({
    example: "Norwegian"
  })
  language: string;

  @IsString()
  @ApiProperty({
    example: "https://en.wikipedia.org/wiki/A_Doll%27s_House"
  })
  link: string;

  @IsInt()
  @ApiProperty({
    example: 68
  })
  pages: number;

  @IsString()
  @ApiProperty({
    example: "A Doll's House"
  })
  title: string;

  @IsInt()
  @ApiProperty({
    example: 1879
  })
  year: number;
}
