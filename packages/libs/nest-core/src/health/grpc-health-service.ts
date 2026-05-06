import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

interface HealthCheckRequest {
  service: string;
}

interface HealthCheckResponse {
  status: ServingStatus;
}

@Controller()
export class GrpcHealthService {
  private readonly statusMap = new Map<string, ServingStatus>([['', ServingStatus.SERVING]]);

  setStatus(service: string, status: ServingStatus): void {
    this.statusMap.set(service, status);
  }

  @GrpcMethod('Health', 'Check')
  check(req: HealthCheckRequest): HealthCheckResponse {
    const status = this.statusMap.get(req.service ?? '') ?? ServingStatus.UNKNOWN;
    return { status };
  }
}
