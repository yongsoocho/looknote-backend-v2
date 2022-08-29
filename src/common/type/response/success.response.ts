import { SuccessResponse } from './index';
import { ApiProperty } from '@nestjs/swagger';

export class FulfilledResponse extends SuccessResponse {
  @ApiProperty({ example: 'fulfilled' })
  data: string;
}

export class AvailableResponse extends SuccessResponse {
  @ApiProperty({ example: 'available' })
  data: string;
}

export class VersionResponse extends SuccessResponse {
  @ApiProperty({ example: 'false', description: 'true시 강제 업데이트' })
  data: boolean;
}
