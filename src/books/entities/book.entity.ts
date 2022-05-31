import { Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';

// https://github.com/benoitvallon/100-best-books
// {
//   "author": "Chinua Achebe",
//   "country": "Nigeria",
//   "imageLink": "images/things-fall-apart.jpg",
//   "language": "English",
//   "link": "https://en.wikipedia.org/wiki/Things_Fall_Apart\n",
//   "pages": 209,
//   "title": "Things Fall Apart",
//   "year": 1958
// }

@Entity()
export class Book {
  constructor(id?: string) {
    if (id) this._id = id as any
  }

  @ObjectIdColumn()
  // ObjectID: https://typeorm.delightful.studio/classes/_driver_mongodb_typings_.objectid.html
  // the actual type is ObjectID, for simplicity I use string type
  _id: string;

  @Column()
  author: string;

  @Column()
  country: string;

  @Column()
  imageLink: string;

  @Column()
  language: string;

  @Column()
  link: string;

  @Column()
  pages: number;

  @Column()
  // https://www.mongodb.com/docs/manual/core/index-text/
  // this @Index decorator is not working with MongoDb, 
  // we create full text index with db.collection.createIndex()
  title: string;

  @Column()
  year: number;

}
