import { spawn, ChildProcess } from 'node:child_process';
import { join } from 'node:path';
import { waitForPortOpen } from '@nx/node/utils';

const ROOT = join(__dirname, '..', '..', '..', '..', '..');
const SERVICE_A_PORT = Number(process.env.SERVICE_A_GRPC_PORT ?? 50051);
const SERVICE_B_PORT = Number(process.env.SERVICE_B_GRPC_PORT ?? 50052);
const SERVICE_A_HTTP = Number(process.env.SERVICE_A_HTTP_PORT ?? 3010);
const SERVICE_B_HTTP = Number(process.env.SERVICE_B_HTTP_PORT ?? 3011);

declare global {
  // eslint-disable-next-line no-var
  var __E2E_PROCS__: ChildProcess[];
}

function spawnService(name: 'service-a' | 'service-b', env: NodeJS.ProcessEnv): ChildProcess {
  const main = join(ROOT, 'packages', 'apps', name, 'dist', 'main.js');
  const proc = spawn(process.execPath, [main], {
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proc.stdout?.on('data', (d) => process.stdout.write(`[${name}] ${d}`));
  proc.stderr?.on('data', (d) => process.stderr.write(`[${name}] ${d}`));
  return proc;
}

module.exports = async function () {
  const procs: ChildProcess[] = [];

  procs.push(
    spawnService('service-b', {
      NODE_ENV: 'test',
      GRPC_URL: `0.0.0.0:${SERVICE_B_PORT}`,
      PORT: String(SERVICE_B_HTTP),
      LOG_LEVEL: 'warn',
    }),
  );
  await waitForPortOpen(SERVICE_B_PORT, { host: '127.0.0.1' });

  procs.push(
    spawnService('service-a', {
      NODE_ENV: 'test',
      GRPC_URL: `0.0.0.0:${SERVICE_A_PORT}`,
      PORT: String(SERVICE_A_HTTP),
      SERVICE_B_URL: `127.0.0.1:${SERVICE_B_PORT}`,
      LOG_LEVEL: 'warn',
    }),
  );
  await waitForPortOpen(SERVICE_A_PORT, { host: '127.0.0.1' });

  globalThis.__E2E_PROCS__ = procs;
};
