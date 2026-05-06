import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from '@nestjs/common';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { Observable, tap, catchError, throwError } from 'rxjs';

const tracer = trace.getTracer('nest-core');

@Injectable()
export class OtelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctxType = context.getType();
    const handler = context.getHandler().name;
    const cls = context.getClass().name;
    const spanName = `${ctxType}.${cls}.${handler}`;

    return new Observable((subscriber) => {
      tracer.startActiveSpan(spanName, (span) => {
        next
          .handle()
          .pipe(
            tap((value) => {
              span.setStatus({ code: SpanStatusCode.OK });
              subscriber.next(value);
            }),
            catchError((err) => {
              span.recordException(err);
              span.setStatus({ code: SpanStatusCode.ERROR, message: String(err?.message ?? err) });
              return throwError(() => err);
            }),
          )
          .subscribe({
            next: () => undefined,
            error: (err) => {
              span.end();
              subscriber.error(err);
            },
            complete: () => {
              span.end();
              subscriber.complete();
            },
          });
      });
    });
  }
}
