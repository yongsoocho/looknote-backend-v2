import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { InterServerResponse } from '../common/type/response/error.response';
import { VersionResponse } from '../common/type/response/success.response';
import { VersionBody } from '../common/type/request';

@Controller()
@ApiTags('DEFAULT controller')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'health check',
    description: '로드 밸런서 연결 확인',
  })
  elbHealthCheckResponse(): string {
    return this.appService.elbHealthCheckResponse();
  }

  @Get('/error')
  @ApiOperation({
    summary: '에러 내리기',
    description: '서버 에러 발생 시키기',
  })
  @ApiInternalServerErrorResponse({ type: InterServerResponse })
  errorTest() {
    throw new HttpException('error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Post('/version')
  @ApiOperation({
    summary: '버젼 확인',
    description: '업데이트가 필요하면 true 반환',
  })
  @ApiBody({
    type: VersionBody,
    description: '홀수(테스트)는 무조건 false, deprecated 배포(짝수)만 true',
  })
  @ApiCreatedResponse({ type: VersionResponse })
  isNeedUpdate(@Body('version') version) {
    return this.appService.isNeedUpdate(version);
  }
}
