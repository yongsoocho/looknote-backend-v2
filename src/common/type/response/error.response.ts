import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '.';

export class UnauthorizedError extends ErrorResponse {
  @ApiProperty({ example: 401, description: 'statusCode' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', description: 'message' })
  message: string;
}

export class InterServerResponse extends ErrorResponse {
  @ApiProperty({ example: 'internal server error' })
  data: string;
}

export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({ example: 'not found' })
  data: string;
}

export class InUseResponse extends ErrorResponse {
  @ApiProperty({ example: 'inUse' })
  data: string;
}

export class RejectedResponse extends ErrorResponse {
  @ApiProperty({ example: 'rejected' })
  data: string;
}
