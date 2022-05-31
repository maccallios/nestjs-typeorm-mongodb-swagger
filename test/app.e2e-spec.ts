import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getMongoManager, MongoEntityManager } from "typeorm";
import { Book } from './../src/books/entities/book.entity';
import { LibUtil } from './../src/lib';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let json_books_plain: Book[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    json_books_plain = LibUtil.getBooksJsonAllSorted()

    await request(app.getHttpServer())
      .get('/books/seed')
  });

  afterEach(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    // await request(app.getHttpServer())
    //   .get('/books/db-clear')
    const manager = getMongoManager();
    await manager.connection.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
    // .expect('this is root');
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect(json_books_plain);
  });

  it('/books/:id (GET)', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      await request(app.getHttpServer())
        .get(`/books/${book._id}`)
        .expect(200)
        .expect(book)
    }
  });

  it('/books/title/:title (GET)', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const res: request.Response = await request(app.getHttpServer())
        .get(`/books/title/${book.title}`)
        .expect(200)
        .expect('Content-Type', /json/)

      const found = res.body
      expect(found.length).toBeLessThanOrEqual(booksShuffled.length / 2)
      expect(found).toContainEqual(book)
    }
  });

  it('/books/:id (PATCH) should update', async () => {
    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { _id } = book
      const randomBook = LibUtil.genRandomBook();
      await request(app.getHttpServer())
        .patch(`/books/${_id}`)
        .send(randomBook)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ n: 1, nModified: 1, ok: 1 })

      await request(app.getHttpServer())
        .get(`/books/${_id}`)
        .expect(200)
        .expect({ _id, ...randomBook });
    }
  });

  it('/books/:id (POST) should create', async () => {
    await request(app.getHttpServer())
      .get('/books/clear')
    await request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect([]);

    const booksShuffled = LibUtil.getBooksJsonShuffled();
    for (const book of booksShuffled) {
      const { _id } = book

      await request(app.getHttpServer())
        .post(`/books`)
        .send({ ...book, author: 100 })
        .expect(HttpStatus.FORBIDDEN)
        .expect('Content-Type', /json/)

      await request(app.getHttpServer())
        .post(`/books`)
        .send(book)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect({ _id, ...book })

      await request(app.getHttpServer())
        .get(`/books/${_id}`)
        .expect(200)
        .expect({ _id, ...book });
    }
  });

});
