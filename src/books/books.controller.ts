import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';
import { MongoDBRemoveResultRet, MongoDBUpdateResultRet } from './../typing';
// import { LoggerMiddleware } from './../loggerMiddleware';
import { BooksService } from './books.service';
import { BooksValidationPipe } from './books.validationPipe';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    // private readonly loggerMiddleware: LoggerMiddleware,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'validates and inserts the json book object into the database',
    description: `it validates only the field data types(string, number), 
    example:
    "constraints":{"isString":"author must be a string"}`
  })
  create(@Body(BooksValidationPipe) createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'list all items' })
  // @ApiOkResponse({ type: [CreateBookDto] })
  findAll() {
    return this.booksService.findAll();
  }

  @Get('/clear')
  @ApiOperation({ summary: 'truncates the book collecttion' })
  clear() {
    return this.booksService.clear();
  }

  @Get('/seed')
  @ApiOperation({ summary: 'truncates the book collecttion' })
  seed() {
    return this.booksService.collectionSeed();
  }

  @Get('/title/:title')
  // @ApiOkResponse({ type: [CreateBookDto] })
  @ApiOperation({ summary: 'search by title, returns array, case insensitive, splits regex: /[\s\t\-_]+/, OR query' })
  @ApiParam({ name: "title", example: "A Doll's House" })
  findBybyTitle(@Param('title') title: string) {
    return this.booksService.findBybyTitle(title);
  }

  @Get(':id')
  // @ApiOkResponse({ type: CreateBookDto })
  @ApiOperation({ summary: 'search by id, returns one item or none' })
  @ApiParam({ name: "id", example: "6291eecef5bc45db818395a4" })
  findOne(@Param('id') id: string) {
    return this.booksService.findOneById(id) as any;
  }

  @Patch(':id')
  @ApiOkResponse({ type: MongoDBUpdateResultRet })
  @ApiParam({ name: "id", example: "6291eecef5bc45db818395a4" })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: "id", example: "6291eecef5bc45db818395a4" })
  @ApiOkResponse({ type: MongoDBRemoveResultRet })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
