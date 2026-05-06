import { credentials, loadPackageDefinition, Client, ServiceClientConstructor } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'node:path';

const SERVICE_A_PORT = Number(process.env.SERVICE_A_GRPC_PORT ?? 50051);
const SERVICE_A_PROTO = join(__dirname, '..', '..', '..', '..', 'libs', 'proto', 'src', 'proto', 'service-a.proto');

interface PingResponse {
  message: string;
  timestamp: string | number;
}

interface ServiceAClient extends Client {
  Ping(req: { message: string }, cb: (err: Error | null, res: PingResponse) => void): void;
}

describe('services-grpc e2e', () => {
  let client: ServiceAClient;

  beforeAll(() => {
    const def = loadSync(SERVICE_A_PROTO, {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const pkg = loadPackageDefinition(def) as any;
    const Ctor = pkg.nestmono.servicea.v1.ServiceAService as ServiceClientConstructor;
    client = new Ctor(`127.0.0.1:${SERVICE_A_PORT}`, credentials.createInsecure()) as ServiceAClient;
  });

  afterAll(() => {
    client?.close();
  });

  it('service-a Ping → service-b Echo round-trip', async () => {
    const res = await new Promise<PingResponse>((resolve, reject) => {
      client.Ping({ message: 'hello' }, (err, r) => (err ? reject(err) : resolve(r)));
    });
    expect(res.message).toBe('a-pong:b-echo:hello');
    expect(Number(res.timestamp)).toBeGreaterThan(0);
  });
});
