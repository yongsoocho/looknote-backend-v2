import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class PagePipe implements PipeTransform {
  transform(value) {
    if (value === undefined || !value) {
      return 1;
    } else {
      return Number(value);
    }
  }
}
