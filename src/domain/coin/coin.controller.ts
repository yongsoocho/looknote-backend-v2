import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtGuard';
import { CoinService } from './coin.service';
import { UnauthorizedError } from '../../common/type/response/error.response';
import { PageNationQuery } from '../../common/type/request';
import { PagePipe } from '../../common/pipe/PagePipe';

@Controller('coin')
@UseGuards(JwtAuthGuard)
@ApiTags('COIN controller')
@ApiUnauthorizedResponse({ type: UnauthorizedError, description: '토큰 에러' })
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Post('test')
  testFlightCoin(
    @Body('user_id', ParseIntPipe) user_id: number,
    @Body('coin', ParseIntPipe) coin: number,
  ) {
    if (process.env.NODE_ENV === 'dev') {
      return this.coinService.testFlightCoin(user_id, coin);
    }
    return 'coin';
  }

  @Get('shop')
  @ApiOperation({ summary: '코인 샵(테스트)' })
  @ApiQuery({ type: PageNationQuery })
  @ApiOkResponse({})
  getCoinShopList(
    @Query('size', PagePipe) size: number,
    @Query('page', PagePipe) page: number,
  ) {
    return this.coinService.getCoinShopList(size, page);
  }
}
