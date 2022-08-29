import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty({ description: 'post_id ' })
  post_id: number;

  @ApiProperty({ description: 'Array<string>' })
  imageURL: Array<string>;

  @ApiProperty({ description: 'scrap' })
  scrap: number;

  @ApiProperty({ description: 'comment' })
  comment: number;

  @ApiProperty({ description: 'user_id ' })
  user_id: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;
}
