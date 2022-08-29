import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class VersionPipe implements PipeTransform {
  transform(value) {
    return Number(value.split('.').join(''));
  }
}
