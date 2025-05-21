import {
  ExceptionFilter,
  Catch,
  Logger,
  HttpStatus,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorType {
  response: { message: string };
}
const isErrorType = (
  exception: Record<string, unknown> | ErrorType,
): exception is ErrorType => {
  if ('response' in exception) {
    if (
      typeof exception.response === 'object' &&
      exception.response != null &&
      'message' in exception.response
    ) {
      return true;
    }
  }
  return false;
};
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: Record<string, unknown> | ErrorType, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const error = {
      code: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      msg: isHttpException ? exception.message : '内部错误',
      detail: isErrorType(exception) ? exception.response.message : '',
    };
    this.logger.error(exception);
    this.logger.error(
      error,
      'stack' in exception && !isHttpException && exception.stack,
    );
    response.status(httpStatus).json(error);
  }
}
