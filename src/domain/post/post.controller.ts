import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { PagePipe } from 'src/common/pipe/PagePipe';
import { UserIdBody, PostIdBody } from 'src/common/type/request';
import { JwtAuthGuard } from '../../common/guard/JwtGuard';
import { StringIntPipe } from '../../common/pipe/StringIntPipe';
import {
  CreateCodyPostDto,
  CreateCommentDto,
  PatchCommentDto,
} from './post.dto';
import { PostService } from './post.service';
import { PageNationQuery, CommentIdBody } from '../../common/type/request';
import {
  PostDetailResponse,
  PostResponse,
  PostsWithIsScrapIsSubscribeResponse,
  PostsWithIsScrapResponse,
} from '../../common/type/response/post.response';
import {
  UnauthorizedError,
  NotFoundResponse,
} from '../../common/type/response/error.response';
import { CommentsResponse } from 'src/common/type/response/comment.response';
import { CreateCommentResponse } from '../../common/type/response/comment.response';
import { FulfilledResponse } from '../../common/type/response/success.response';

@Controller('post')
@ApiTags('POST controller')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 220530 type
  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '코디 가져오기' })
  @ApiOkResponse({ type: PostsWithIsScrapResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  getCodyPostWithPagenation(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.postService.getCodyPostWithPagenation(size, page, req.user);
  }

  @Get('/popular')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '인기순 코디 가져오기' })
  @ApiOkResponse({ type: PostsWithIsScrapResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  getCodyVoguePostWithPagenation(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.postService.getCodyVoguePostWithPagenation(
      size,
      page,
      req.user,
    );
  }

  // test only
  @Post('/popular')
  addVogueForTest(@Body('post_id', ParseIntPipe) post_id: number) {
    return this.postService.addVogueForTest(post_id);
  }

  @Post('/search/userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 id 로 코디 검색',
    description: '유저가 만든 코디 검색',
  })
  @ApiBody({ type: UserIdBody })
  @ApiQuery({ type: PageNationQuery })
  @ApiOkResponse({ type: PostsWithIsScrapIsSubscribeResponse })
  findCodyPostsByAuthorId(
    @Body('user_id', StringIntPipe) user_id: number,
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
    @Req() req,
  ) {
    return this.postService.findCodyPostsByUserId(
      user_id,
      size,
      page,
      req.user,
    );
  }

  // 220530 type
  @Post('/search/detail')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '코디 상세정보',
    description: '댓글은 20개 1페이지를 불러옴',
  })
  @ApiBody({ type: PostIdBody })
  @ApiCreatedResponse({ type: PostDetailResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  getDetailCodyPost(
    @Body('post_id', StringIntPipe) post_id: number,
    @Req() req,
  ) {
    return this.postService.getDetailCodyPost(post_id, req.user);
  }

  // 220530 type
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 1))
  @ApiOperation({
    summary: '코디 생성',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateCodyPostDto,
  })
  @ApiCreatedResponse({
    type: PostResponse,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @ApiInternalServerErrorResponse({ description: '사진이 없으면 500을 반환' })
  createCodyPost(@UploadedFiles() images, @Req() req) {
    return this.postService.createCodyPost(images, req.user);
  }

  // 220530 type
  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '코디 삭제',
  })
  @ApiBody({
    type: PostIdBody,
  })
  @ApiCreatedResponse({ type: PostResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  deleteCodyPost(@Body('post_id', StringIntPipe) post_id: number, @Req() req) {
    return this.postService.deleteCodyPost(post_id, req.user);
  }

  // 220530 type
  @Get('/comment')
  @ApiOperation({
    summary: '댓글 가져오기',
    description: 'post_id 코디에서 댓글가져오기',
  })
  @ApiCreatedResponse({ type: CommentsResponse })
  getCommentsListWhichInCodyPost(
    @Query('post_id', StringIntPipe) post_id: number,
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
  ) {
    return this.postService.getCommentsListWhichInCodyPost(post_id, size, page);
  }

  // 220530 type
  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 생성하기',
  })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiCreatedResponse({ type: CreateCommentResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  createComment(@Body() createCommentBody: CreateCommentDto, @Req() req) {
    return this.postService.createComment(createCommentBody, req.user);
  }

  // 220530 type
  @Delete('/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 삭제하기' })
  @ApiBody({ type: CommentIdBody })
  @ApiCreatedResponse({ type: FulfilledResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  deleteComment(
    @Body('comment_id', StringIntPipe) comment_id: number,
    @Req() req,
  ) {
    return this.postService.deleteComment(comment_id, req.user);
  }

  @Patch('/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 수정하기 (테스트)',
  })
  @ApiBody({ type: PatchCommentDto })
  @ApiCreatedResponse({ type: FulfilledResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  patchCommentContent(@Body() patchCommentBody: PatchCommentDto, @Req() req) {
    return this.postService.patchCommentContent(patchCommentBody, req.user);
  }
}
