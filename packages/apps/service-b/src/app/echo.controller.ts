import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ServiceBV1 } from '@nest-mono/proto';

@Controller()
export class EchoController {
  @GrpcMethod('ServiceBService', 'Echo')
  echo(req: ServiceBV1.EchoRequest): ServiceBV1.EchoResponse {
    return { payload: `b-echo:${req.payload}`, timestamp: Date.now() };
  }
}
