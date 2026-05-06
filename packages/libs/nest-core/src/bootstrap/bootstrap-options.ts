export interface GrpcBootstrapOptions {
  package: string | string[];
  protoPath: string | string[];
  url: string;
}

export interface HttpBootstrapOptions {
  port: number;
  host?: string;
}

export interface SwaggerBootstrapOptions {
  path?: string;
  description?: string;
  version?: string;
}

export interface BootstrapOptions {
  name: string;
  grpc: GrpcBootstrapOptions;
  http: HttpBootstrapOptions;
  swagger?: SwaggerBootstrapOptions;
}
