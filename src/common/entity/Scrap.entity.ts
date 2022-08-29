import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from './Post.entity';
import { UserEntity } from './User.entity';

export class ScrapEntity {
  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiPropertyOptional({ type: PostEntity, description: 'Post Entity' })
  post: PostEntity;

  @ApiPropertyOptional({ type: UserEntity, description: 'User Entity' })
  user: UserEntity;
}
