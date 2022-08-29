import { ApiProperty } from '@nestjs/swagger';

export class PageNationQuery {
  @ApiProperty({ example: 1, description: 'page' })
  page: number;

  @ApiProperty({ example: 1, description: 'size' })
  size: number;
}

export class CommentPageNationQuery extends PageNationQuery {
  @ApiProperty({ example: 25, description: 'post_id' })
  post_id: number;
}

export class PostIdBody {
  @ApiProperty({ example: 25, description: 'post_id' })
  post_id: number;
}

export class UserIdBody {
  @ApiProperty({ example: 25, description: 'user_id' })
  user_id: number;
}

export class CommentIdBody {
  @ApiProperty({ example: 25, description: 'comment_id' })
  comment_id: number;
}

export class IdTokenBody {
  @ApiProperty({ description: 'id_token' })
  id_token: string;
}

export class AccessTokenBody {
  @ApiProperty({ description: 'access_token' })
  access_token: string;
}

export class EmailBody {
  @ApiProperty({ description: 'email' })
  email: string;
}

export class NicknameBody {
  @ApiProperty({ description: 'nickname' })
  nickname: string;
}

export class VersionBody {
  @ApiProperty({ description: 'version' })
  version: string;
}

export class DeviceTokenBody {
  @ApiProperty({ description: 'device_token' })
  device_token: string;
}
