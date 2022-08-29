import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from './User.entity';

export class CoinEntity {
  @ApiProperty({ description: 'coin_id' })
  coin_id: number;

  @ApiProperty({ description: 'coin' })
  coin: number;

  @ApiProperty({ description: 'coin_sum' })
  coin_sum: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiPropertyOptional({ type: UserEntity, description: 'User Entity' })
  user: UserEntity;
}
