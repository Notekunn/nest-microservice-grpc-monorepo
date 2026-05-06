import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { ServiceAV1, ServiceBV1 } from '@nest-mono/proto';

interface ServiceBClient {
  echo(req: ServiceBV1.EchoRequest): Observable<ServiceBV1.EchoResponse>;
}

@Controller()
export class PingController implements OnModuleInit {
  private bClient!: ServiceBClient;

  constructor(@Inject('SERVICE_B') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.bClient = this.client.getService<ServiceBClient>('ServiceBService');
  }

  @GrpcMethod('ServiceAService', 'Ping')
  async ping(req: ServiceAV1.PingRequest): Promise<ServiceAV1.PingResponse> {
    const echo = await firstValueFrom(this.bClient.echo({ payload: req.message }));
    return { message: `a-pong:${echo.payload}`, timestamp: Date.now() };
  }
}
