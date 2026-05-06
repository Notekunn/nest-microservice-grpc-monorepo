import { baseEnvSchema, validateEnv } from './env-schema.js';

describe('env-schema', () => {
  it('applies defaults', () => {
    const v = validateEnv(baseEnvSchema)({});
    expect(v.NODE_ENV).toBe('development');
    expect(v.LOG_LEVEL).toBe('info');
  });

  it('throws on invalid NODE_ENV', () => {
    expect(() => validateEnv(baseEnvSchema)({ NODE_ENV: 'bogus' })).toThrow(/Invalid environment/);
  });
});
