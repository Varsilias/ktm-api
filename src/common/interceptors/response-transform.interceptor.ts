import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  message: string;
  data: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const code = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        if (data && !data.code && typeof data !== 'string') {
          return { status: 'Success', message: 'Request Successful', data };
        }

        if (typeof data === 'string' && !code.toString().startsWith('2')) {
          return { status: 'error', message: data };
        }

        return data;
      }),
    );
  }
}
