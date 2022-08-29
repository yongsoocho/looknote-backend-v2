import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserEntity } from './User.entity';

export class QuitEntity {
  constructor() {
    this.quit_id = 1;
    this.user_id = 5;
    this.reason = '삭제 이유';
    this.email = 'example@test.com';
    this.created_at = '2011-10-05T14:48:00.000Z';
  }

  @ApiProperty({ description: 'quit_id' })
  quit_id: number;

  @ApiProperty({ description: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'reason' })
  reason: string;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'ISO' })
  created_at: string;

  @ApiPropertyOptional({ type: new UserEntity(), description: 'User Entity' })
  user: UserEntity;
}
