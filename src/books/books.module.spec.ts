import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<Book>> = jest.fn(() => ({
  findOne: jest.fn((...args) => {
    return {
      findOne: true,
      args,
    }
  }),
  find: jest.fn((...args) => {
    return {
      mock_find: true,
      args,
    }
  }),
  // ...
}));

// we test with mock repository
describe('BooksModule', () => {
  let bookController: BooksController;
  let bookService: BooksService;
  let bookRepositoryMock: MockType<Repository<Book>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        // Provide the mock instead of the actual repository
        {
          provide: getRepositoryToken(Book),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    bookService = module.get<BooksService>(BooksService);
    bookController = module.get<BooksController>(BooksController);
    bookRepositoryMock = module.get(getRepositoryToken(Book));
  });

  it('repositoryMock', () => {
    expect(bookRepositoryMock).toBeDefined();
  });

  it('bookService', () => {
    expect(bookService).toBeDefined();
  });

  it('bookController', () => {
    expect(bookController).toBeDefined();
  });

  it('should find a book by id using mock repository', async () => {
    const _id = 'some_id'
    // Now we can control the return value of the mock's methods
    // it uses mock reposittory, findOne: jest.fn(entity => entity),
    expect(bookService.findOneById(_id)).toEqual({
      findOne: true,
      args: [{ _id }],
    });
    // And make assertions on how often and with what params your mock's methods are called
    expect(bookRepositoryMock.findOne).toHaveBeenCalledTimes(1)
    expect(bookRepositoryMock.findOne).toHaveBeenCalledWith({ _id });
  });

  it('should find a book by tittle using mock repository', async () => {
    const words = ['Rock', 'Paper', 'Scissor'];
    const title = words.sort(() => 0.5 - Math.random()).join(' ');
    const query = BooksService.getMongoQuerySearchByTitle(title)
    expect(bookService.findBybyTitle(title)).toEqual({
      mock_find: true,
      args: [query]
    });
    expect(bookRepositoryMock.find).toHaveBeenCalledTimes(1)
    expect(bookRepositoryMock.find).toHaveBeenCalledWith(query);
  });
});
