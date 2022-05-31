import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    example: "the author of the book is 'Henrik Ibsen'"
  })
  author?: string;

  @ApiProperty({
    example: "the title of the book is 'A Doll's House'"
  })
  title: string;
}
