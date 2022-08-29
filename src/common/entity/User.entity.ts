import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: '2' })
  user_id: number;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'nickname' })
  nickname: string;

  @ApiPropertyOptional({ description: 'password' })
  password?: string;

  @ApiProperty({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender: string;

  @ApiProperty({ enum: ['LOCAL', 'APPLE', 'KAKAO'] })
  provider: string;

  @ApiProperty({ description: '19980923' })
  date_of_birth: number;

  @ApiProperty({ description: 'ISO' })
  created_at: string;

  @ApiProperty({ description: 'active' })
  active: boolean;

  @ApiPropertyOptional({ description: 'sns_id' })
  sns_id: string;
}
