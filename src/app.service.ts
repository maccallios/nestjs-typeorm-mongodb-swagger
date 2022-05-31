import { Injectable } from '@nestjs/common';
import { Connection, EntityManager, MongoEntityManager } from 'typeorm';
import { Book } from './books/entities/book.entity';
import { LibUtil } from './lib';

@Injectable()
export class AppService {
  constructor(private readonly connection: Connection) { }

  getEntityManager(): MongoEntityManager {
    const manager: EntityManager = this.connection.manager
    return manager as MongoEntityManager;
  }

  // async dbReset() {
  //   return LibUtil.dbReset(this.connection)
  // }

  // async dbSeed(): Promise<Book[]> {
  //   return LibUtil.dbSeed(this.connection)
  // }

  // testConnection(): string {
  //   console.log('connection: ', this.connection)
  //   return 'this is root';
  // }
  getRootMessage(): string {
    return 'this is root';
  }

}
