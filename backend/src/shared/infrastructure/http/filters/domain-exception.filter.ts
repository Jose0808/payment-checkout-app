import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '@shared/domain/result/result';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (this.isDomainError(exception)) {
      status = exception.statusCode || HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = exception.code;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private isDomainError(error: unknown): error is DomainError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'code' in error
    );
  }
}
