import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export * as ServiceAV1 from './generated/nestmono/servicea/v1/service.pb.js';
export * as ServiceBV1 from './generated/nestmono/serviceb/v1/service.pb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolves to dist/proto at runtime (compiled JS at dist/src/index.js).
// Override with PROTO_DIR env var (e.g., in Docker images).
export const PROTO_DIR = process.env.PROTO_DIR ?? join(__dirname, '..', 'proto');
export const SERVICE_A_PROTO = join(PROTO_DIR, 'nestmono/servicea/v1/service.proto');
export const SERVICE_B_PROTO = join(PROTO_DIR, 'nestmono/serviceb/v1/service.proto');
