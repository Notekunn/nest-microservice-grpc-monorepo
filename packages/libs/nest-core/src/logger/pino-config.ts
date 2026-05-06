import type { Params } from 'nestjs-pino';

export function createPinoConfig(opts?: { level?: string; pretty?: boolean }): Params {
  const level = opts?.level ?? process.env['LOG_LEVEL'] ?? 'info';
  const pretty = opts?.pretty ?? process.env['NODE_ENV'] !== 'production';
  return {
    pinoHttp: {
      level,
      transport: pretty
        ? { target: 'pino-pretty', options: { singleLine: true, colorize: true } }
        : undefined,
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      customProps: () => ({ context: 'HTTP' }),
    },
  };
}
