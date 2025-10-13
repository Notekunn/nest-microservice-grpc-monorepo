import { registerAs } from '@nestjs/config';
import {
  IsNumberString,
  IsOptional,
  IsSemVer,
  IsString,
} from 'class-validator';

export interface AppConfiguration {
  readonly name: string;
  readonly host: string;
  readonly httpPort: number;
  readonly tcpPort: number;
  readonly grpcPort: number;
  readonly version: string;
  readonly session: string;
  readonly corsOrigins: string[];
}

export class AppEnvironmentSchema {
  @IsString()
  SERVICE_HOST: string;

  @IsNumberString()
  SERVICE_PORT: string;

  @IsString()
  @IsSemVer()
  @IsOptional()
  SERVICE_VERSION: string;

  @IsNumberString()
  SERVICE_TCP: string;

  @IsNumberString()
  @IsOptional()
  SERVICE_GRPC: string;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string;
}

export const appConfiguration = registerAs<AppConfiguration>('app', () => {
  const appName =
    process.env['SERVICE_NAME'] || process.env['npm_package_name'] || '';
  const appVersion =
    process.env['SERVICE_VERSION'] ||
    process.env['npm_package_version'] ||
    '0.0.0';
  const session = `${appName}-${new Date().getTime()}`;
  const corsOrigins = (process.env['CORS_ORIGIN'] || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  return {
    name: appName,
    host: process.env['SERVICE_HOST'] || '0.0.0.0',
    httpPort: +(process.env['SERVICE_PORT'] || 3000),
    tcpPort: +(process.env['SERVICE_TCP'] || 3100),
    grpcPort: +(process.env['SERVICE_GRPC'] || 3200),
    version: appVersion,
    session,
    corsOrigins: corsOrigins.length > 0 ? corsOrigins : ['*'],
  };
});
