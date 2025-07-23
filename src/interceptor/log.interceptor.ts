import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
@UseInterceptors(LogInterceptor)
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    console.log(`date now ${Date.now() - now} ms`);

    return next
      .handle()
      .pipe(tap(() => console.log(`date now ${Date.now() - now} ms`)));
  }
}
