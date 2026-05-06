import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ZodError } from 'zod';
import { status as GrpcStatus } from '@grpc/grpc-js';
import type { ArgumentsHost } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions-filter.js';

const httpHost = (reply: { status: jest.Mock; send: jest.Mock }): ArgumentsHost =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({ getResponse: () => reply }),
  }) as unknown as ArgumentsHost;

const rpcHost = (): ArgumentsHost =>
  ({
    getType: () => 'rpc',
  }) as unknown as ArgumentsHost;

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('maps NotFoundException to 404 + NOT_FOUND on http', () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const reply = { status, send } as unknown as { status: jest.Mock; send: jest.Mock };
    filter.catch(new NotFoundException('missing'), httpHost(reply));
    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ code: 'NOT_FOUND', statusCode: 404 }));
  });

  it('maps ZodError to 400 INVALID_ARGUMENT on http', () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const reply = { status, send } as unknown as { status: jest.Mock; send: jest.Mock };
    const zerr = new ZodError([]);
    filter.catch(zerr, httpHost(reply));
    expect(status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_ARGUMENT' }));
  });

  it('maps BadRequest to grpc INVALID_ARGUMENT on rpc', async () => {
    const result = filter.catch(new BadRequestException('bad'), rpcHost());
    await expect(result as Promise<unknown>).rejects.toMatchObject({
      code: GrpcStatus.INVALID_ARGUMENT,
      message: 'bad',
    });
  });
});
