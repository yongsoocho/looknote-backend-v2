import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCodyPostDto {
  @ApiProperty({ description: 'images' })
  images;
}

export class CreateCommentDto {
  @ApiProperty({ example: 8, description: 'post_id' })
  @IsNotEmpty()
  post_id: number | string;

  @ApiProperty({ example: '댓글 내용입니다.', description: 'content' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class PatchCommentDto {
  @ApiProperty({ example: 8, description: 'comment_id' })
  @IsNotEmpty()
  comment_id: number | string;

  @ApiProperty({ example: '댓글 내용입니다.', description: 'content' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
