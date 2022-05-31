import { ApiProperty } from '@nestjs/swagger';

export type MongoDBUpdateResult = {
  ok: number;
  n: number;
  nModified: number;
};

export type MongoDBRemoveResult = {
  ok?: number;
  n?: number;
};

export class MongoDBUpdateResultRet {
  @ApiProperty({
    example: 1
  })
  ok?: number;
  @ApiProperty({
    example: 1
  })
  n?: number;
  @ApiProperty({
    example: 1
  })
  nModified?: number;
};

export class MongoDBRemoveResultRet {
  @ApiProperty({
    example: 1
  })
  ok?: number;
  @ApiProperty({
    example: 1
  })
  n?: number;
};

