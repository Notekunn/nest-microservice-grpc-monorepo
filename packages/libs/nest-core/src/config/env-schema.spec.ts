import { baseEnvSchema, validateEnv } from './env-schema.js';

describe('env-schema', () => {
  it('applies defaults', () => {
    const v = validateEnv(baseEnvSchema)({});
    expect(v.NODE_ENV).toBe('development');
    expect(v.PORT).toBe(3000);
    expect(v.GRPC_URL).toBe('0.0.0.0:50051');
    expect(v.LOG_LEVEL).toBe('info');
  });

  it('coerces PORT to number', () => {
    const v = validateEnv(baseEnvSchema)({ PORT: '4000' });
    expect(v.PORT).toBe(4000);
  });

  it('throws on invalid NODE_ENV', () => {
    expect(() => validateEnv(baseEnvSchema)({ NODE_ENV: 'bogus' })).toThrow(/Invalid environment/);
  });
});
