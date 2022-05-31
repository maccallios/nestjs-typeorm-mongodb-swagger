import { readFileSync } from 'fs'
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, EntityManager, getConnectionOptions, getMongoManager, MongoEntityManager } from "typeorm";
import { Book } from './books/entities/book.entity';

// const maxBooks = -2

// we created this static class for methods which get repeated 
// by service and tests
export class LibUtil {
  static getBooksJsonAllSorted(): Book[] {
    let json_books: Book[] = JSON.parse(readFileSync(path.join(__dirname, '..', 'resource/books.json'), 'utf-8'))
    // sort by Title for convenience
    json_books.sort((a, b) => a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase()))
    // if (maxBooks > 0) json_books = json_books.slice(0, maxBooks)
    return json_books
  }

  static getBooksJsonShuffled(): Book[] {
    const json_books: Book[] = this.getBooksJsonAllSorted()
    json_books.sort((a, b) => 0.5 - Math.random())
    return json_books
  }

  static getBookEntities(): Book[] {
    return this.getBooksJsonAllSorted().map(json => {
      return Object.assign(new Book(json._id), json)
    })
  }

  static getEntityManager(connection: Connection): MongoEntityManager {
    const manager: EntityManager = connection.manager
    return manager as MongoEntityManager;
  }

  // static async dbReset(connection: Connection) {
  //   const manager: MongoEntityManager = this.getEntityManager(connection);
  //   let res: string = 'ok'
  //   try {
  //     await manager.clear(Book)
  //     await manager.connection.synchronize()
  //     const repo = manager.getMongoRepository<Book>(Book)
  //     await repo.createCollectionIndex({ title: "text" }, {
  //       "name": "title_full_text",
  //       "default_language": "en",
  //       "language_override": "__language__"
  //     } as any);
  //   } catch (error) {
  //     const { message } = error
  //     if (message != 'ns not found') {
  //       throw error
  //     }
  //   }
  //   return res
  // }

  // static async dbSeed(connection: Connection): Promise<Book[]> {
  //   const manager: MongoEntityManager = this.getEntityManager(connection);
  //   await this.dbReset(connection)
  //   const json_books = LibUtil.getBookEntities()
  //   const saved: Book[] = await manager.save(json_books)
  //   return saved
  // }

  // static async dbReset() {
  //   const manager: MongoEntityManager = getMongoManager();
  //   let res: string = 'ok'
  //   try {
  //     await manager.clear(Book)
  //     await manager.connection.synchronize()
  //     const repo = manager.getMongoRepository<Book>(Book)
  //     await repo.createCollectionIndex({ title: "text" }, {
  //       "name": "title_full_text",
  //       "default_language": "en",
  //       "language_override": "__language__"
  //     } as any);
  //   } catch (error) {
  //     const { message } = error
  //     if (message != 'ns not found') {
  //       throw error
  //     }
  //   }
  //   return res
  // }

  // static async dbSeed(): Promise<Book[]> {
  //   const manager: MongoEntityManager = getMongoManager();
  //   await this.dbReset()
  //   const json_books = this.getBooks()
  //   const saved: Book[] = await manager.save(json_books)
  //   return saved
  // }

  static genRandomBook(): Book {
    const randSentence = (sentence: string[] = []): string => {
      const words = ["bird", "teacher", "duck", "clock",
        "boy", "plastic", "old lady",
        "professor", "hamster", "dog"];
      if (sentence.length >= 4) return sentence.join(' ')
      const rand = Math.floor(Math.random() * words.length)
      sentence.push(words[rand])
      return randSentence(sentence)
    }
    const getRandNumber = (): number => Math.floor(Math.random() * 100)

    const book: any = {
      // "_id": "6291eecef5bc45db81839577",
      "author": randSentence(),
      "country": randSentence(),
      "imageLink": randSentence(),
      "language": randSentence(),
      "link": randSentence(),
      "pages": getRandNumber(),
      "title": randSentence(),
      "year": getRandNumber()
    }
    return book
  }
}

// export const get_typeorm_forRoot_dynamic_module = () => TypeOrmModule.forRootAsync({
//   useFactory: async () =>
//     Object.assign(await getConnectionOptions(), {
//       // "entities": [
//       //   "dist/**/entities/*.entity.js"
//       // ],
//       // autoLoadEntities: true,
//     }),
// })

// export const TypeOrmTestingModule = () => [
//   get_typeorm_forRoot_dynamic_module(),
//   // TypeOrmModule.forRoot(),
//   TypeOrmModule.forFeature([Book]),
// ];
