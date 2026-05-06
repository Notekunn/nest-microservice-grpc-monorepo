import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export * as ServiceAV1 from './generated/service-a.pb.js';
export * as ServiceBV1 from './generated/service-b.pb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolves to dist/proto at runtime (compiled JS at dist/src/index.js).
// Override with PROTO_DIR env var (e.g., in Docker images).
export const PROTO_DIR = process.env.PROTO_DIR ?? join(__dirname, '..', 'proto');
export const SERVICE_A_PROTO = join(PROTO_DIR, 'service-a.proto');
export const SERVICE_B_PROTO = join(PROTO_DIR, 'service-b.proto');
