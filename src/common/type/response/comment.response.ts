import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './index';
import { UserSub } from './user.response';

class CommentSub {
  constructor() {
    this.comment_id = 10;
    this.content = 'content';
    this.updated_at = '2011-10-05T14:48:00.000Z';
    this.user = new UserSub();
  }

  @ApiProperty({ description: 'comment_id' })
  comment_id: number;

  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiProperty({ example: new UserSub() })
  user: UserSub;
}
export class CommentsResponse extends SuccessResponse {
  @ApiProperty({ example: [new CommentSub()] })
  data: CommentSub;
}

class CreateCommentSub {
  constructor() {
    this.comment_id = 5;
    this.content = 'content';
    this.updated_at = '2011-10-05T14:48:00.000Z';
    this.post_id = 10;
    this.user_id = 10;
  }

  @ApiProperty({ description: 'comment_id' })
  comment_id: number;

  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;
}
export class CreateCommentResponse extends SuccessResponse {
  @ApiProperty({ example: new CreateCommentSub() })
  data: CreateCommentSub;
}
