import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Book } from './books/entities/book.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionOptions, getMongoManager } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: getConnectionOptions,
        }),
        TypeOrmModule.forFeature([Book])
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(async () => {
    const manager = getMongoManager();
    await manager.connection.close()
  })

  it('appController is defined', async () => {
    expect(appController).toBeDefined();
  });

});
