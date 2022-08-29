import { SuccessResponse } from './index';
import { ApiProperty } from '@nestjs/swagger';
import { Coin } from './coin.response';
import { UserEntity } from '../../entity/User.entity';
import { QuitEntity } from 'src/common/entity/Quit.entity';

export class UserSub {
  constructor() {
    this.user_id = 5;
    this.nickname = 'yonggari';
  }

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'nickname' })
  nickname: string;
}
class User {
  constructor() {
    this.email = 'example@test.com';
    this.name = '조용수';
    this.nickname = 'yonggari';
    this.gender = 'ETC';
    this.provider = 'LOCAL';
    this.date_of_birth = 19980923;
    this.user_id = 25;
    this.created_at = '2011-10-05T14:48:00.000Z';
    this.active = true;
    this.coin = new Coin();
  }

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'nickname' })
  nickname: string;

  @ApiProperty({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender: string;

  @ApiProperty({ enum: ['LOCAL', 'KAKAO', 'APPLE'] })
  provider: string;

  @ApiProperty({ description: 'date_of_birth' })
  date_of_birth: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'ISO' })
  created_at: string;

  @ApiProperty({ description: 'active' })
  active: boolean;

  @ApiProperty({ example: Coin })
  coin: Coin;
}
class UserProp {
  constructor() {
    this.user = new User();
    this.access_token = 'access_token';
  }

  @ApiProperty({ example: new User() })
  user: User;

  @ApiProperty({ description: 'access_token' })
  access_token: string;
}
export class UserResponse extends SuccessResponse {
  @ApiProperty({ example: new UserProp() })
  data: UserProp;
}

export class DeleteUserResponse extends SuccessResponse {
  @ApiProperty({ example: new UserEntity() })
  data: UserEntity;
}

export class CreateQuitResponse extends SuccessResponse {
  @ApiProperty({ example: new QuitEntity() })
  data: QuitEntity;
}

export class ReportResponse extends SuccessResponse {
  @ApiProperty({ example: [1, 2, 3] })
  data: Array<number>;
}
