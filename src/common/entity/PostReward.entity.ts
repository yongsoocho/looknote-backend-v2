import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from './Post.entity';

export class PostRewardEntity {
  @ApiProperty({ description: 'post_reward_id' })
  post_reward_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'post' })
  post: number;

  @ApiProperty({ description: 'reward' })
  reward: boolean;

  @ApiPropertyOptional({ type: PostEntity, description: 'Post Entity' })
  user: PostEntity;
}
