import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class StringIntPipe implements PipeTransform {
  transform(value) {
    if (typeof value === 'string') {
      return Number(value);
    } else if (typeof value === 'number') {
      return value;
    }
  }
}
