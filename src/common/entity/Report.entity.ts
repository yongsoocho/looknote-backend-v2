import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from './Post.entity';
import { UserEntity } from './User.entity';

export class ReportEntity {
  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: string;

  @ApiPropertyOptional({ type: PostEntity, description: 'Post Entity' })
  post: PostEntity;

  @ApiPropertyOptional({ type: UserEntity, description: 'User Entity' })
  user: UserEntity;
}
