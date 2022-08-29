import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './index';
import { UserSub } from './user.response';

export class Push {
  constructor() {
    this.push_id = 3;
    this.user_id = 7;
    this.from_id = 5;
    this.type = 'comment';
    this.imageURL = 'url';
    this.created_at = '2011-10-05T14:48:00.000Z';
    this.from = new UserSub();
  }

  @ApiProperty({ description: 'push_id' })
  push_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'from_id' })
  from_id: number;

  @ApiProperty({ description: 'type' })
  type: string;

  @ApiProperty({ description: 'imageURL' })
  imageURL: string;

  @ApiProperty({ description: 'ISO' })
  created_at: string;

  @ApiProperty({ example: new UserSub() })
  from: UserSub;
}
export class PushResponse extends SuccessResponse {
  @ApiProperty({ example: new Push() })
  data: Push;
}
