import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, UpdateWriteOpResult } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { MongoDBRemoveResult, MongoDBUpdateResult } from 'src/typing';
import { LibUtil } from './../lib';

@Injectable()
export class BooksService {
  logger: Logger;

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: MongoRepository<Book>,
  ) {
    this.logger = new Logger();
  }

  static getMongoQuerySearchByTitle(title: string): Object {
    title = title.toLocaleLowerCase()
    const parts = title.split(/[\s\t\-_]+/)
    const query = {
      where: {
        $text: { $search: parts.join(' ') },
      },
      score: { $meta: "textScore" }
    }
    return query
  }

  async createFullTextIndex() {
    try {
      // await this.clear()
      // we create full text index on field "title" => { title: "text" }
      await this.bookRepository.manager.connection.synchronize()
      await this.bookRepository.createCollectionIndex({ title: "text" }, {
        "name": "title_full_text",
        "default_language": "en",
        "language_override": "__language__"
      } as any);
    } catch (error) {
      const { message } = error
      if (message != 'ns not found') {
        throw error
      }
    }
  }

  async clear(): Promise<string> {
    await this.bookRepository.clear()
    await this.createFullTextIndex()
    return 'ok'
  }

  async collectionSeed(): Promise<Book[]> {
    this.logger.log('* booksService.collectionSeed')
    await this.clear()
    const json_books = LibUtil.getBookEntities()
    const saved: Book[] = await this.bookRepository.manager.save(json_books)
    return saved
  }

  create(createBookDto: CreateBookDto) {
    return this.bookRepository.save(createBookDto);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  findOneById(_id: any) {
    return this.bookRepository.findOne({ _id });
  }

  findBybyTitle(title: string) {
    const query = BooksService.getMongoQuerySearchByTitle(title)
    return this.bookRepository.find(query)
  }

  async update(_id: any, updateBookDto: UpdateBookDto): Promise<MongoDBUpdateResult> {
    const updated: UpdateWriteOpResult = await this.bookRepository.updateOne({ _id }, { "$set": updateBookDto }, {
      upsert: false
    })
    return updated.result
  }

  async remove(_id: any): Promise<MongoDBRemoveResult> {
    const removed = await this.bookRepository.deleteOne({ _id })
    return removed.result
  }

  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onModuleInit() {
    await this.collectionSeed()
  }

}
