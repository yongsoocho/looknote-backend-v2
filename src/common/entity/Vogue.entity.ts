import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from './Post.entity';

export class VogueEntity {
  @ApiProperty({ description: 'vogue_id ' })
  vogue_id: number;

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiPropertyOptional({ type: PostEntity, description: 'Post Entity' })
  post: PostEntity;
}
