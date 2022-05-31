import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from "typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';

@Module({
  // we import with TypeOrmModule with forRootAsync getConnectionOptions,
  // ottherwise it will not pick up the ormconfig.json
  imports: [TypeOrmModule.forRootAsync({
    useFactory: getConnectionOptions
  }), BooksModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
