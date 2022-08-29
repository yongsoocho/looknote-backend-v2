import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { PagePipe } from 'src/common/pipe/PagePipe';
import { JwtAuthGuard } from '../../common/guard/JwtGuard';
import { MyNoteService } from './mynote.service';
import { UnauthorizedError } from '../../common/type/response/error.response';
import { PageNationQuery, UserIdBody } from '../../common/type/request';
import { PostIdBody } from 'src/common/type/request';
import {
  RemoveScrapResponse,
  AddScrapResponse,
  SubscribeCountResponse,
} from '../../common/type/response/mynote.response';
import { CoinResponse } from '../../common/type/response/coin.response';
import { PostsWithIsScrapResponse } from '../../common/type/response/post.response';
import { PushResponse } from 'src/common/type/response/push.response';
import { FulfilledResponse } from '../../common/type/response/success.response';

@Controller('mynote')
@UseGuards(JwtAuthGuard)
@ApiTags('MYNOTE controller')
@ApiUnauthorizedResponse({ type: UnauthorizedError })
export class MyNoteController {
  constructor(private readonly myNoteService: MyNoteService) {}

  @Get('/')
  @ApiOperation({
    summary: '마이노트 가져오기',
  })
  @ApiOkResponse({ type: PostsWithIsScrapResponse })
  getMyNoteCodyPostList(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.myNoteService.getMyNoteCodyPostList(req.user, size, page);
  }

  // 220530 type
  @Get('/scrap')
  @ApiOperation({
    summary: '스크랩 코디 가져오기',
    description: '보관했던 코디들 가져오기',
  })
  @ApiOkResponse({
    type: PostsWithIsScrapResponse,
  })
  getMyScrapList(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.myNoteService.getMyScrapList(req.user, size, page);
  }

  // 220530 type
  @Post('/scrap')
  @ApiOperation({
    summary: '스크랩 토글',
    description: '저장된 것은 보관함에서 삭제, 보관함에 없는 것은 추가',
  })
  @ApiBody({ type: PostIdBody })
  @ApiOkResponse({ type: AddScrapResponse, description: '생성 (201)' })
  @ApiCreatedResponse({ type: RemoveScrapResponse, description: '삭제' })
  addToMyScrapList(@Body('post_id', ParseIntPipe) post_id: number, @Req() req) {
    return this.myNoteService.toggleScrap(post_id, req.user);
  }

  // 220530 type
  @ApiOperation({ summary: '유저 코인 정보' })
  @ApiOkResponse({ type: CoinResponse })
  @Get('/coin')
  getCoinInfo(@Req() req) {
    return this.myNoteService.getCoinInfo(req.user);
  }

  @ApiOperation({ summary: '유저 푸쉬 알람 정보 불러오기' })
  @ApiQuery({ type: PageNationQuery })
  @ApiOkResponse({ type: PushResponse })
  @Get('/push')
  getPushAlarmList(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.myNoteService.getPushAlarmList(size, page, req.user);
  }

  @Get('/subscribe')
  @ApiOperation({
    summary: '구독자 수 가져오기',
  })
  @ApiCreatedResponse({ type: SubscribeCountResponse })
  getSubscribeCount(@Req() req) {
    return this.myNoteService.getSubscribeCount(req.user);
  }

  @Post('/subscribe')
  @ApiOperation({
    summary: '구독 토글',
  })
  @ApiBody({
    type: UserIdBody,
  })
  @ApiCreatedResponse({ type: FulfilledResponse })
  toggleSubscribe(@Body('user_id', ParseIntPipe) user_id: number, @Req() req) {
    return this.myNoteService.toggleSubscribe(user_id, req.user);
  }
}
