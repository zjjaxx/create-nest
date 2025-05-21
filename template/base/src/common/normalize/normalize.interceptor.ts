import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
export interface Response<T> {
  code: 200;
  data: T;
  msg: 'ok';
}

@Injectable()
export class NormalizeInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return { data, code: 200, msg: 'ok' };
      }), // 正常响应包装
    );
  }
}
