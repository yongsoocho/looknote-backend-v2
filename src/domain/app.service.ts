import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  elbHealthCheckResponse(): string {
    return 'Hello World!!';
  }

  async isNeedUpdate(version) {
    // 홀수버젼이면 테스트버젼이라 false 반환
    const int_version = Number(version.split('.').join(''));
    if (int_version % 2 === 1) {
      return false;
    }
    // 최신버젼 0.1.18 이 아니면 true 반환
    return version !== '0.1.18';
  }
}
