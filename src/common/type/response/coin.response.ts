import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './index';

export class Coin {
  constructor() {
    this.coin_id = 5;
    this.coin = 1000;
    this.coin_sum = 2000;
    this.updated_at = '2011-10-05T14:48:00.000Z';
  }

  @ApiProperty({ description: 'coin_id' })
  coin_id: number;

  @ApiProperty({ description: 'coin' })
  coin: number;

  @ApiProperty({ description: 'coin_sum' })
  coin_sum: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;
}
export class CoinResponse extends SuccessResponse {
  @ApiProperty({ example: new Coin() })
  data: Coin;
}
