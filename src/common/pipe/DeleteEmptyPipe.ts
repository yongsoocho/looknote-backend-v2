import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteEmptyPipe implements PipeTransform {
  transform(value) {
    const filteredObj = {};
    Object.entries(value).forEach((e) => {
      if (e[1]) {
        if (e[0] === 'date_of_birth') {
          filteredObj[e[0]] = Number(e[1]);
        } else {
          filteredObj[e[0]] = e[1];
        }
      }
    });
    return filteredObj;
  }
}
