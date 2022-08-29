import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './index';

class AddScrapSub {
  constructor() {
    this.post_id = 3;
    this.imageURL = ['url'];
  }

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'imageURL' })
  imageURL: Array<string>;
}
class AddScrapProp {
  constructor() {
    this.post = new AddScrapSub();
  }

  @ApiProperty({ example: new AddScrapSub(), description: 'post' })
  post: AddScrapSub;
}
export class AddScrapResponse extends SuccessResponse {
  @ApiProperty({ example: new AddScrapProp() })
  data: AddScrapProp;
}

class RemoveScrapProp {
  constructor() {
    this.post_id = 3;
    this.user_id = 5;
  }

  @ApiProperty({ description: 'post_id' })
  post_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;
}
export class RemoveScrapResponse extends SuccessResponse {
  @ApiProperty({ example: new RemoveScrapProp() })
  data: RemoveScrapProp;
}

class SubscribeCountProp {
  constructor() {
    this.user_id = 3;
    this.subscriber = 10;
    this.subscribing = 20;
  }

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'subscriber' })
  subscriber: number;

  @ApiProperty({ description: 'subscribing' })
  subscribing: number;
}
export class SubscribeCountResponse extends SuccessResponse {
  @ApiProperty({ example: new SubscribeCountProp() })
  data: SubscribeCountProp;
}
