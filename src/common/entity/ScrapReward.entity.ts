import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from './User.entity';

export class ScrapRewardEntity {
  @ApiProperty({ description: 'scrap_reward_id' })
  scrap_reward_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'scrap' })
  scrap: number;

  @ApiProperty({ description: 'count' })
  count: number;

  @ApiPropertyOptional({ type: UserEntity, description: 'User Entity' })
  user: UserEntity;
}
