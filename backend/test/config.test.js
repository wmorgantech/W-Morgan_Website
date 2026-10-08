const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { getConfig } = require('../src/config/env');

const validEnv = {
  JWT_SECRET: 'jwt-secret-with-at-least-32-bytes',
  CORS_ORIGINS: 'http://localhost:5173,https://admin.example.com',
  PORT: '3000',
};

describe('environment configuration', () => {
  it('requires a JWT secret with at least 32 bytes', () => {
    assert.throws(
      () => getConfig({ ...validEnv, JWT_SECRET: 'too-short' }),
      /JWT_SECRET must contain at least 32 bytes/,
    );
  });

  it('rejects a short setup token and accepts strong secrets', () => {
    assert.throws(
      () =>
        getConfig({
          ...validEnv,
          ADMIN_SETUP_TOKEN: 'too-short',
        }),
      /ADMIN_SETUP_TOKEN must contain at least 32 bytes/,
    );

    const config = getConfig({
      ...validEnv,
      ADMIN_SETUP_TOKEN: 'setup-token-with-at-least-32-bytes',
    });
    assert.equal(config.adminSetupToken, 'setup-token-with-at-least-32-bytes');
    assert.equal(config.port, 3000);
    assert.deepEqual(config.corsOrigins, [
      'http://localhost:5173',
      'https://admin.example.com',
    ]);

    const { PORT: _port, ...envWithoutPort } = validEnv;
    assert.equal(getConfig(envWithoutPort).port, 3001);
  });

  it('requires valid ports and an explicit production port', () => {
    assert.throws(
      () => getConfig({ ...validEnv, PORT: '70000' }),
      /PORT must be an integer/,
    );
    const { PORT: _port, ...productionEnv } = validEnv;
    assert.throws(
      () => getConfig({ ...productionEnv, NODE_ENV: 'production' }),
      /PORT must be explicitly configured in production/,
    );
  });

  it('requires an explicit valid CORS allowlist', () => {
    assert.throws(
      () => getConfig({ ...validEnv, CORS_ORIGINS: '' }),
      /CORS_ORIGINS must contain at least one/,
    );
    assert.throws(
      () => getConfig({ ...validEnv, CORS_ORIGINS: '*' }),
      /CORS_ORIGINS contains an invalid origin/,
    );
  });
});
