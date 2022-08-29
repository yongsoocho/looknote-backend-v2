import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({ description: 'date_of_birth' })
  date_of_birth?: string;

  @ApiPropertyOptional({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender?: string;
}

export class LocalLoginDto {
  @ApiProperty({ description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AppleJoinDto {
  @ApiProperty({ description: 'id_token' })
  @IsString()
  @IsNotEmpty()
  id_token: string;

  @ApiProperty({ description: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'password' })
  password?: string;

  @ApiProperty({ description: 'nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({ description: 'date_of_birth' })
  date_of_birth?: string;

  @ApiPropertyOptional({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender: string;
}

export class KakaoJoinDto {
  @ApiProperty({ description: 'access_token' })
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({ description: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'password' })
  password?: string;

  @ApiProperty({ description: 'nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({ description: 'date_of_birth' })
  date_of_birth?: string | number;

  @ApiPropertyOptional({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender?: string;
}

export class EmailCodeDto {
  @ApiProperty({ description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class PatchPasswordDto {
  @ApiProperty({ description: 'email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class WithdrawDto {
  @ApiProperty({ description: 'reason' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class PatchUserDto {
  @ApiPropertyOptional({ description: 'name' })
  name?: string;

  @ApiPropertyOptional({ description: 'nickname' })
  nickname?: string;

  @ApiPropertyOptional({ description: 'date_of_birth' })
  date_of_birth?: string;

  @ApiPropertyOptional({ enum: ['ETC', 'MALE', 'FEMALE'] })
  gender?: any;
}

export class UserSearchWithNicknameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
