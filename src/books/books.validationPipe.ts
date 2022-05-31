import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class BooksValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {

    const obj = plainToClass(metatype, value)
    const errors = await validate(obj)

    if (errors.length > 0) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'validation failed',
        errors: JSON.stringify(errors),
      }, HttpStatus.FORBIDDEN)
    }

    return value
  }
}
