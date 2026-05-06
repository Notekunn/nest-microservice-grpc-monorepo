import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ZodError } from 'zod';

interface FastifyReplyLike {
  status(code: number): { send(body: unknown): unknown };
}

interface ErrorBody {
  statusCode: number;
  message: string;
  code: string;
  details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): unknown {
    const type = host.getType<'http' | 'rpc'>();
    const body = this.toErrorBody(exception);

    this.logger.error(`[${type}] ${body.code} ${body.message}`);

    if (type === 'rpc') {
      return Promise.reject(
        new RpcException({
          code: this.httpToGrpc(body.statusCode),
          message: body.message,
        }).getError(),
      );
    }

    const reply = host.switchToHttp().getResponse<FastifyReplyLike>();
    return reply.status(body.statusCode).send(body);
  }

  private toErrorBody(exception: unknown): ErrorBody {
    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'INVALID_ARGUMENT',
        message: 'Validation failed',
        details: exception.flatten(),
      };
    }
    if (exception instanceof RpcException) {
      const err = exception.getError();
      const obj = typeof err === 'object' && err !== null ? (err as Record<string, unknown>) : {};
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: String(obj['code'] ?? 'INTERNAL'),
        message: String(obj['message'] ?? 'Internal error'),
      };
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string' ? res : ((res as { message?: string }).message ?? exception.message);
      return {
        statusCode: status,
        code: this.httpCodeToToken(status),
        message,
      };
    }
    const message = exception instanceof Error ? exception.message : 'Unknown error';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL',
      message,
    };
  }

  private httpToGrpc(status: number): GrpcStatus {
    switch (status) {
      case 400:
        return GrpcStatus.INVALID_ARGUMENT;
      case 401:
        return GrpcStatus.UNAUTHENTICATED;
      case 403:
        return GrpcStatus.PERMISSION_DENIED;
      case 404:
        return GrpcStatus.NOT_FOUND;
      case 409:
        return GrpcStatus.ALREADY_EXISTS;
      case 429:
        return GrpcStatus.RESOURCE_EXHAUSTED;
      case 503:
        return GrpcStatus.UNAVAILABLE;
      default:
        return GrpcStatus.INTERNAL;
    }
  }

  private httpCodeToToken(status: number): string {
    const map: Record<number, string> = {
      400: 'INVALID_ARGUMENT',
      401: 'UNAUTHENTICATED',
      403: 'PERMISSION_DENIED',
      404: 'NOT_FOUND',
      409: 'ALREADY_EXISTS',
      429: 'RESOURCE_EXHAUSTED',
      503: 'UNAVAILABLE',
    };
    return map[status] ?? 'INTERNAL';
  }
}
