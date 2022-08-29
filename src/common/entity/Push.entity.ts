import { ApiProperty } from '@nestjs/swagger';

export class PushEntity {
  @ApiProperty({ description: 'push_id' })
  push_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'from_id' })
  from_id: number;

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'type' })
  type: string;

  @ApiProperty({ description: 'imageURL' })
  imageURL: string;

  @ApiProperty({ description: 'ISO' })
  created_at: string;
}
