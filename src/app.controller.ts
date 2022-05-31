import { Headers, Body, Controller, Get, Ip, Query, All } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

export interface responseObjType {
  "headers": Headers,
  "body": Body,
  "query": object,
  "ip": string
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get('/db/reset')
  // @ApiOperation({ summary: 'resets the collection, all the data cleared' })
  // dbReset() {
  //   return this.appService.dbReset()
  // }

  // @Get('/db/seed')
  // @ApiOperation({ summary: 'loads seed books database', description: 'database from https://github.com/benoitvallon/100-best-books' })
  // dbSeed(): Promise<Book[]> {
  //   return this.appService.dbSeed();
  // }

  @All()
  getRoot(@Headers() headers: Headers, @Body() body: Body, @Query() query: object, @Ip() ip: string): responseObjType {
    // return this.appService.getRootMessage();
    const resObj = {
      headers,
      body,
      query,
      ip
    }
    return resObj;
  }

}
