// https://orkhan.gitbook.io/typeorm/docs/mongodb

import { getConnectionOptions, createConnection, Connection, MongoEntityManager, getMongoRepository, MongoRepository } from "typeorm";
import { getMongoManager } from "typeorm";
import { Book } from './books/entities/book.entity';
import { LibUtil } from './lib';

// export const createTypeORMConnection = async (): Promise<Connection> => {
//   console.log(process.env.NODE_ENV);
//   const connectionOptions = await getConnectionOptions(process.env.NODE_ENV!);
//   console.log(connectionOptions);
//   const connection: Connection = await createConnection(connectionOptions);
//   console.log('** success: connected');
//   return connection;
// };

// const init = async () => {
//   await createTypeORMConnection()
//   const manager: MongoEntityManager = getMongoManager();
//   const bookRepository: MongoRepository<Book> = getMongoRepository(Book)

//   const json_books = LibUtil.getBooks()
//   console.log(json_books.slice(0, 2))

//   await manager.clear(Book)
//   await manager.save(json_books)

//   const books: Book[] = await bookRepository.find()
//   // console.log(books)

//   await manager.connection.close()
// }

// init()
