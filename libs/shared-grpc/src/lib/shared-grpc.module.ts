import { DynamicModule,Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export interface GrpcModuleOptions {
  name: string;
  transport: Transport.GRPC;
  options: {
    url: string;
    package: string;
    protoPath: string[];
  };
}

@Module({})
export class SharedGrpcModule {
  static forRoot(options: GrpcModuleOptions): DynamicModule {
    return {
      module: SharedGrpcModule,
      imports: [
        ClientsModule.register([
          {
            name: options.name,
            transport: Transport.GRPC,
            options: {
              ...options.options,
              protoPath: options.options.protoPath.map((path) =>
                join(__dirname, '..', path)
              ),
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forRootAsync(options: {
    name: string;
    useFactory: (...args: any[]) => GrpcModuleOptions['options'];
    inject?: any[];
  }): DynamicModule {
    return {
      module: SharedGrpcModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: options.name,
            useFactory: async (...args: any[]) => {
              const config = await options.useFactory(...args);
              return {
                transport: Transport.GRPC,
                options: {
                  ...config,
                  protoPath: config.protoPath.map((path) =>
                    join(__dirname, '..', path)
                  ),
                },
              };
            },
            inject: options.inject || [],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
