import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { ManagerGuard } from '../../common/guard/ManagerGuard';

@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Get()
  test() {
    if (process.env.NODE_ENV === 'dev') {
      return this.fcmService.getFcmToken(1);
    }
    return;
  }

  @Post()
  setTest() {
    if (process.env.NODE_ENV === 'dev') {
      return this.fcmService.sendPush(63, 'hi~');
    }
    return;
  }

  @Post('all')
  @UseGuards(ManagerGuard)
  sendPushToALl(@Body('body') body, @Req() req) {
    return this.fcmService.sendPushAll(body, req.manager);
  }
}
