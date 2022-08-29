import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({ example: '201', description: 'statusCode' })
  statusCode: number;

  @ApiProperty({ example: true, description: 'success' })
  success: boolean;

  @ApiProperty({ example: false, description: 'error' })
  error: boolean;

  @ApiProperty({ example: '100ms', description: 'duration' })
  duration: string;
}

export class ErrorResponse {
  @ApiProperty({ example: '500', description: 'statusCode' })
  statusCode: number;

  @ApiProperty({ example: false, description: 'success' })
  success: boolean;

  @ApiProperty({ example: true, description: 'error' })
  error: boolean;

  @ApiProperty({
    example: '2022-05-18T16:17:51.254Z',
    description: 'timestamp',
  })
  timestamp: string;
}
