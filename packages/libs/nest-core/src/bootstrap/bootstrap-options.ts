export interface GrpcBootstrapOptions {
  package: string | string[];
  protoPath: string | string[];
  url: string;
  // Path to a FileDescriptorSet binary (e.g. produced by `buf build -o`).
  // When set, gRPC server reflection is enabled — disable by omitting.
  descriptorPath?: string;
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
