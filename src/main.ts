import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('The books API description')
    .setVersion('1.0')
    .addTag('books')
    .setExternalDoc('Postman Collection', '/api-json')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // console.log('document', document)
  // console.log('document', JSON.stringify(document, null, 2))

  SwaggerModule.setup('/api', app, document);

  await app.listen(3000);
}
bootstrap();
