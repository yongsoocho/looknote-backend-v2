import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status ? status : HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      error: true,
      timestamp: new Date().toISOString(),
      data: exception.message ? exception.message : 'api broken',
    });
  }
}
