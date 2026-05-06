import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Metadata } from '@grpc/grpc-js';
import type { Observable } from 'rxjs';

export const AUTH_METADATA_KEY = 'authorization';

@Injectable()
export class GrpcMetadataAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'rpc') return next.handle();

    const rpc = context.switchToRpc();
    const metadata = rpc.getContext<Metadata>();
    const auth = metadata?.get?.(AUTH_METADATA_KEY)?.[0];
    if (auth) {
      const data = rpc.getData<Record<string, unknown>>();
      if (data && typeof data === 'object') {
        (data as Record<string, unknown>)['__auth'] = String(auth);
      }
    }
    return next.handle();
  }
}
