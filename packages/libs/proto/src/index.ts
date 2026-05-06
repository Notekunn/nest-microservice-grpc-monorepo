import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export * as ServiceAV1 from './generated/service-a.pb.js';
export * as ServiceBV1 from './generated/service-b.pb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolution order:
//   1. PROTO_DIR env (Docker images)
//   2. <bundleDir>/proto       — webpack-bundled apps copy protos next to main.js
//   3. <bundleDir>/../proto    — standalone @nx/js:tsc build (dist/src/index.js + dist/proto)
//   4. <bundleDir>/src/proto   — pnpm dev fallback (workspace symlink to source)
function resolveProtoDir(): string {
  if (process.env.PROTO_DIR) return process.env.PROTO_DIR;
  const candidates = [
    join(__dirname, 'proto'),
    join(__dirname, '..', 'proto'),
    join(__dirname, 'src', 'proto'),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return candidates[0];
}

export const PROTO_DIR = resolveProtoDir();
export const SERVICE_A_PROTO = join(PROTO_DIR, 'service-a.proto');
export const SERVICE_B_PROTO = join(PROTO_DIR, 'service-b.proto');

// Per-service FileDescriptorSet binaries used by gRPC server reflection.
// Generated via `buf build --path <proto> -o <name>.binpb`.
export const SERVICE_A_DESCRIPTOR = join(PROTO_DIR, 'service-a.binpb');
export const SERVICE_B_DESCRIPTOR = join(PROTO_DIR, 'service-b.binpb');
