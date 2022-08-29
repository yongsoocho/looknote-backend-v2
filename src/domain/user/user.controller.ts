import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { DeleteEmptyPipe } from 'src/common/pipe/DeleteEmptyPipe';
import { JwtAuthGuard } from '../../common/guard/JwtGuard';
import {
  AppleJoinDto,
  CreateUserDto,
  EmailCodeDto,
  KakaoJoinDto,
  LocalLoginDto,
  PatchPasswordDto,
  PatchUserDto,
  WithdrawDto,
} from './user.dto';
import { UserService } from './user.service';
import { StringIntPipe } from '../../common/pipe/StringIntPipe';
import {
  CreateQuitResponse,
  DeleteUserResponse,
  ReportResponse,
  UserResponse,
  UserSub,
} from 'src/common/type/response/user.response';
import {
  UnauthorizedError,
  InUseResponse,
  NotFoundResponse,
  RejectedResponse,
} from '../../common/type/response/error.response';
import {
  DeviceTokenBody,
  EmailBody,
  IdTokenBody,
  PostIdBody,
  UserIdBody,
} from 'src/common/type/request';
import { AccessTokenBody, NicknameBody } from '../../common/type/request';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AvailableResponse,
  FulfilledResponse,
} from 'src/common/type/response/success.response';
import { SnsUserResponse } from '../../common/type/user.type';

@Controller('/user')
@ApiTags('USER controller')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/join')
  @ApiOperation({ summary: '로컬 회원가입' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponse })
  localUserJoin(@Body(new DeleteEmptyPipe()) createUserBody: CreateUserDto) {
    return this.userService.localUserJoin(createUserBody);
  }

  @Post('/login')
  @ApiOperation({ summary: '로컬 유저 로그인' })
  @ApiBody({ type: LocalLoginDto })
  @ApiCreatedResponse({ type: UserResponse })
  localUserLogin(@Body() localLoginBody: LocalLoginDto) {
    return this.userService.localUserLogin(localLoginBody);
  }

  @Post('/apple/login')
  @ApiOperation({ summary: '애플 로그인' })
  @ApiBody({ type: IdTokenBody })
  @ApiOkResponse({ type: UserResponse })
  @ApiCreatedResponse({ type: NotFoundResponse })
  async loginWithApple(@Body('id_token') id_token: string, @Res() res) {
    const now = Date.now();
    const data = await this.userService.loginWithApple(id_token);
    return res
      .status(
        data === 'user who have already left'
          ? HttpStatus.NOT_FOUND
          : 'user not found'
          ? HttpStatus.CREATED
          : HttpStatus.OK,
      )
      .json(
        data === 'user who have already left'
          ? {
              statusCode: HttpStatus.NOT_FOUND,
              success: false,
              error: true,
              timestamp: new Date().toISOString(),
              data: 'user who have already left',
            }
          : {
              statusCode:
                data === 'user not found' ? HttpStatus.CREATED : HttpStatus.OK,
              success: true,
              error: false,
              duration: `${Date.now() - now}ms`,
              data: data === 'user not found' ? SnsUserResponse : data,
            },
      );
  }

  @Post('/apple/join')
  @ApiOperation({ summary: '애플 회원가입' })
  @ApiBody({ type: AppleJoinDto })
  @ApiCreatedResponse({
    type: UserResponse,
  })
  joinWithApple(
    @Body('id_token') id_token: string,
    @Body(new DeleteEmptyPipe()) createSocialUserBody: AppleJoinDto,
  ) {
    return this.userService.joinWithApple(id_token, createSocialUserBody);
  }

  @Post('/kakao/login')
  @ApiOperation({ summary: '카카오 로그인' })
  @ApiBody({ type: AccessTokenBody })
  @ApiCreatedResponse({ type: UserResponse })
  async loginWithKakao(@Body('access_token') access_token, @Res() res) {
    const now = Date.now();
    const data = await this.userService.loginWithKakao(access_token);
    return res
      .status(
        data === 'user who have already left'
          ? HttpStatus.NOT_FOUND
          : 'user not found'
          ? HttpStatus.CREATED
          : HttpStatus.OK,
      )
      .json(
        data === 'user who have already left'
          ? {
              statusCode: HttpStatus.NOT_FOUND,
              success: false,
              error: true,
              timestamp: new Date().toISOString(),
              data: 'user who have already left',
            }
          : {
              statusCode:
                data === 'user not found' ? HttpStatus.CREATED : HttpStatus.OK,
              success: true,
              error: false,
              duration: `${Date.now() - now}ms`,
              data: data === 'user not found' ? SnsUserResponse : data,
            },
      );
  }

  @Post('/kakao/join')
  @ApiOperation({
    summary: '카카오 회원가입',
  })
  @ApiBody({ type: KakaoJoinDto })
  @ApiCreatedResponse({
    type: UserResponse,
  })
  joinWithKakao(
    @Body('access_token') access_token,
    @Body(new DeleteEmptyPipe()) createSocialUserBody: KakaoJoinDto,
  ) {
    return this.userService.joinWithKakao(access_token, createSocialUserBody);
  }

  @Get('/relogin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '토큰 재로그인',
  })
  @ApiCreatedResponse({
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  @ApiNotFoundResponse({
    type: NotFoundResponse,
  })
  localUserTokenReLogin(@Req() req) {
    return this.userService.localUserTokenReLogin(req.user);
  }

  @Post('/check/email')
  @ApiOperation({
    summary: '이메일 중복확인',
  })
  @ApiBody({ type: EmailBody })
  @ApiCreatedResponse({
    type: AvailableResponse,
  })
  @ApiConflictResponse({
    type: InUseResponse,
  })
  checkEmailIsInUse(@Body('email') email: string) {
    return this.userService.checkEmailIsInUse(email, 'LOCAL');
  }

  @Post('/check/nickname')
  @ApiOperation({
    summary: '닉네임 중복확인',
  })
  @ApiBody({
    type: NicknameBody,
  })
  @ApiCreatedResponse({
    type: AvailableResponse,
  })
  @ApiConflictResponse({
    type: InUseResponse,
  })
  checkNicknameIsInUse(@Body('nickname') nickname: string) {
    return this.userService.checkNicknameIsInUse(nickname);
  }

  @Post('/code/send')
  @ApiOperation({
    summary: '회원가입 코드 전송',
  })
  @ApiBody({
    type: EmailBody,
  })
  @ApiCreatedResponse({
    type: FulfilledResponse,
  })
  @ApiConflictResponse({
    type: RejectedResponse,
  })
  sendEmailCode(@Body('email') email: string) {
    return this.userService.sendEmailCode(email);
  }

  @Post('/code/check')
  @ApiOperation({
    summary: '회원가입 코드 확인',
  })
  @ApiBody({
    type: EmailCodeDto,
  })
  @ApiCreatedResponse({
    type: FulfilledResponse,
  })
  @ApiUnauthorizedResponse({
    type: RejectedResponse,
  })
  checkEmailCode(@Body('email') email: string, @Body('code') code: string) {
    return this.userService.checkEmailCode(email, code);
  }

  @Post('/password/code')
  @ApiOperation({
    summary: '비밀번호 코드 전송',
  })
  @ApiBody({
    type: EmailBody,
  })
  @ApiCreatedResponse({
    type: FulfilledResponse,
  })
  sendPasswordCode(@Body('email') email: string) {
    return this.userService.sendPasswordCode(email);
  }

  @Post('/password/check')
  @ApiOperation({
    summary: '비밀번호 코드 확인',
  })
  @ApiBody({
    type: EmailCodeDto,
  })
  @ApiCreatedResponse({
    type: FulfilledResponse,
  })
  @ApiUnauthorizedResponse({
    type: RejectedResponse,
  })
  checkPasswordCode(@Body('email') email: string, @Body('code') code: string) {
    return this.userService.checkPasswordCode(email, code);
  }

  @Post('/password/reset')
  @ApiOperation({
    summary: '비밀번호 재설정',
  })
  @ApiBody({
    type: PatchPasswordDto,
  })
  @ApiCreatedResponse({
    type: FulfilledResponse,
  })
  @ApiUnauthorizedResponse({
    type: RejectedResponse,
  })
  patchNewPassword(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('code') code: string,
  ) {
    return this.userService.patchNewPassword(email, password, code);
  }

  @Delete('/user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 탈퇴',
    description: '실제 서버에서는 탈퇴신청, 테스트서버에서는 유저 삭제',
  })
  @ApiBody({
    type: WithdrawDto,
  })
  @ApiResponse({
    type: DeleteUserResponse,
    description: '테스트',
  })
  @ApiOkResponse({
    type: CreateQuitResponse,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  SubmitApplicationForWithdrawal(
    @Body('reason') reason: string,
    @Body('user_id') user_id: number,
    @Body('provider') provider: string,
    @Req() req,
  ) {
    return this.userService.SubmitApplicationForWithdrawal(
      reason,
      user_id,
      provider,
      req.user,
    );
  }

  @Patch('/user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 정보 변경',
  })
  @ApiBody({
    type: PatchUserDto,
  })
  @ApiCreatedResponse({
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  changeUserMetaData(
    @Body(new DeleteEmptyPipe()) patchUserBody: PatchUserDto,
    @Req() req,
  ) {
    return this.userService.changeUserMetaData(patchUserBody, req.user);
  }

  @Get('/report')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '신고 리스트 가져오기',
  })
  @ApiCreatedResponse({
    type: ReportResponse,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  getUserReportList(@Req() req) {
    return this.userService.getUserReportList(req.user);
  }

  @Post('/report')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '신고 리스트 추가',
  })
  @ApiBody({
    type: PostIdBody,
  })
  @ApiCreatedResponse({
    type: ReportResponse,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  submitReport(@Body('post_id', StringIntPipe) post_id, @Req() req) {
    return this.userService.submitReport(post_id, req.user);
  }

  @Post('/search')
  @ApiOperation({
    summary: '유저 검색',
    description: '닉네임으로 검색',
  })
  @ApiBody({
    type: NicknameBody,
  })
  @ApiCreatedResponse({
    type: UserSub,
  })
  userSearchWithNickname(@Body('nickname') nickname: string) {
    return this.userService.userSearchWithNickname(nickname);
  }

  @Post('/fcm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '토큰 서버에 저장',
  })
  @ApiBody({
    type: DeviceTokenBody,
  })
  setFcmToken(@Body('device_token') device_token: string, @Req() req) {
    return this.userService.setFcmToken(device_token, req.user);
  }

  @Get('/test')
  getTestUser() {
    return this.userService.getTestUser();
  }
}
