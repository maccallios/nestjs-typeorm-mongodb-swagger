import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, getConnectionOptions, getMongoManager, Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { LibUtil } from './../../src/lib';
import { ModuleMetadata } from '@nestjs/common';

// this test with live database,
// before each test we reaset and seed the database,
// aftere each test we close the mongodb connection, otherwise it hangs
describe('books.service', () => {
  let bookService: BooksService;
  let bookRepository: Repository<Book>;
  let json_books: Book[];

  beforeEach(async () => {
    const metadata: ModuleMetadata = {
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: getConnectionOptions,
        }),
        TypeOrmModule.forFeature([Book])
      ],
      // we dont use BooksController here
      controllers: [],
      // this is a list of providers that will be instantiated by the Nest injector
      providers: [
        BooksService,
      ],
      exports: []
    }
    const testingModule: TestingModule = await Test.createTestingModule(metadata).compile();

    bookRepository = testingModule.get<Repository<Book>>(getRepositoryToken(Book));
    bookService = testingModule.get<BooksService>(BooksService);

    json_books = LibUtil.getBookEntities()
    await bookService.collectionSeed()
  });

  afterEach(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await bookRepository.manager.connection.close()
  })

  it('bookRepository is defined', () => {
    expect(bookRepository).toBeDefined();
  });

  it('bookService is defined', () => {
    expect(bookService).toBeDefined();
  });

  it('bookService.findAll() should return an array of all the books', async () => {
    const books = await bookService.findAll();
    expect(books).toEqual(json_books);
  });

  it('bookService.findOneById() should find the book by id', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { _id } = book
      const found = await bookService.findOneById(_id)
      expect(book).toEqual(found);
    }
  });

  it('bookService.findBybyTitle() should find the book by tittle', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { title } = book
      const found = await bookService.findBybyTitle(title)
      expect(found.length).toBeLessThanOrEqual(booksShuffled.length / 2)
      expect(found).toContainEqual(book)
    }
  });

  it('bookService.update() should update the book', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { _id } = book
      const randomBook = LibUtil.genRandomBook();
      const result = await bookService.update(_id, randomBook)
      expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
      const updated = await bookService.findOneById(_id)
      expect(updated).toEqual({ _id, ...randomBook });
    }
  });

  it('bookService.remove() should remove the book', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { _id } = book
      const result = await bookService.remove(_id)
      expect(result).toEqual({ n: 1, ok: 1 });
      const found = await bookService.findOneById(_id)
      expect(found).toBeUndefined()
    }
  });

  it('bookService.clear() should truncate the collection', async () => {
    expect((await bookService.findAll()).length).toBeGreaterThan(0);
    await bookService.clear();
    expect((await bookService.findAll()).length).toEqual(0);
  });

  it('bookService.create should save the book', async () => {
    await bookService.clear();
    expect((await bookService.findAll()).length).toEqual(0);
    const books = LibUtil.getBookEntities();
    for (const book of books) {
      const { _id } = book
      const result = await bookService.create(book)
      expect(result).toStrictEqual(book);
      const found = await bookService.findOneById(_id)
      expect(found).toStrictEqual(book)
    }
  });

});
