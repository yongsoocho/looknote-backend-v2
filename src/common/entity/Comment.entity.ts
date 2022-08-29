import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from './Post.entity';
import { UserEntity } from './User.entity';

export class CommentEntity {
  @ApiProperty({ description: 'content ' })
  content: string;

  @ApiProperty({ description: 'comment_id' })
  comment_id: number;

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiPropertyOptional({ type: UserEntity, description: 'User Entity' })
  user: UserEntity;

  @ApiPropertyOptional({ type: PostEntity, description: 'Post Entity' })
  post: PostEntity;
}
