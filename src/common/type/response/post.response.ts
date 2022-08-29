import { SuccessResponse } from './index';
import { ApiProperty } from '@nestjs/swagger';
import { UserSub } from './user.response';

class PostWithIsScrap {
  constructor() {
    this.post_id = 3;
    this.updated_at = '2011-10-05T14:48:00.000Z';
    this.imageURL = ['url'];
    this.scrap = 10;
    this.comment = 5;
    this.is_scrap = true;
  }

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiProperty({ description: 'imageURL' })
  imageURL: Array<string>;

  @ApiProperty({ description: 'scrap' })
  scrap: number;

  @ApiProperty({ description: 'comment' })
  comment: number;

  @ApiProperty({ description: 'is_scrap' })
  is_scrap: boolean;
}
class Pagenation {
  constructor() {
    this.size = 20;
    this.page = 1;
    this.lastPage = 30;
  }

  @ApiProperty({ description: 'size' })
  size: number;

  @ApiProperty({ description: 'page' })
  page: number;

  @ApiProperty({ description: 'lastPage' })
  lastPage: number;
}
class PostsWithIsScrapAndPagenation {
  @ApiProperty({ example: [new PostWithIsScrap()] })
  posts: Array<PostWithIsScrap>;

  @ApiProperty({ example: Pagenation })
  pagenation: Pagenation;
}
class PostsWithIsScrapAndPagenationWithSubscribe extends PostsWithIsScrapAndPagenation {
  @ApiProperty({ example: true })
  is_subscribe: boolean;
}
export class PostsWithIsScrapResponse extends SuccessResponse {
  @ApiProperty({ example: PostsWithIsScrapAndPagenation })
  data: PostsWithIsScrapAndPagenation;
}
export class PostsWithIsScrapIsSubscribeResponse extends SuccessResponse {
  @ApiProperty({ example: PostsWithIsScrapAndPagenationWithSubscribe })
  data: PostsWithIsScrapAndPagenationWithSubscribe;
}

class PostDetailCommentSub {
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
class PostDetailSub {
  constructor() {
    this.post_id = 6;
    this.imageURL = ['url'];
    this.scrap = 20;
    this.comment = 25;
    this.user = new UserSub();
    this.comments = [new PostDetailCommentSub()];
  }

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'imageURL' })
  imageURL: Array<string>;

  @ApiProperty({ description: 'scrap' })
  scrap: number;

  @ApiProperty({ description: 'comment' })
  comment: number;

  @ApiProperty({ example: new UserSub() })
  user: UserSub;

  @ApiProperty({ example: [new PostDetailCommentSub()] })
  comments: Array<PostDetailCommentSub>;
}
export class PostDetailResponse extends SuccessResponse {
  @ApiProperty({ example: new PostDetailSub() })
  data: PostDetailSub;
}

class PostSub {
  constructor() {
    this.post_id = 3;
    this.updated_at = '2011-10-05T14:48:00.000Z';
    this.imageURL = ['url'];
    this.scrap = 10;
    this.comment = 20;
  }

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'ISO' })
  updated_at: string;

  @ApiProperty({ description: 'imageURL' })
  imageURL: Array<string>;

  @ApiProperty({ description: 'scrap' })
  scrap: number;

  @ApiProperty({ description: 'comment' })
  comment: number;
}
export class PostResponse extends SuccessResponse {
  @ApiProperty({ example: new PostSub() })
  data: PostSub;
}
