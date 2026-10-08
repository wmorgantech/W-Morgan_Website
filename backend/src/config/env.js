require('dotenv/config');

function getConfig(env = process.env) {
  const jwtSecret = env.JWT_SECRET;

  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error(
      'JWT_SECRET must contain at least 32 bytes of secret material.',
    );
  }

  const adminSetupToken = env.ADMIN_SETUP_TOKEN || null;
  if (adminSetupToken && Buffer.byteLength(adminSetupToken) < 32) {
    throw new Error(
      'ADMIN_SETUP_TOKEN must contain at least 32 bytes of secret material.',
    );
  }

  const rawPort = env.PORT;
  const port = rawPort === undefined || rawPort === '' ? 3001 : Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  if (
    env.NODE_ENV === 'production' &&
    (rawPort === undefined || rawPort === '')
  ) {
    throw new Error('PORT must be explicitly configured in production.');
  }

  const corsOrigins = (env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (!corsOrigins.length) {
    throw new Error('CORS_ORIGINS must contain at least one allowed origin.');
  }
  for (const origin of corsOrigins) {
    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error(`CORS_ORIGINS contains an invalid origin: ${origin}`);
    }
    if (
      !['http:', 'https:'].includes(parsedOrigin.protocol) ||
      parsedOrigin.origin !== origin
    ) {
      throw new Error(`CORS_ORIGINS contains an invalid origin: ${origin}`);
    }
  }

  return {
    port,
    jwtSecret,
    adminSetupToken,
    jwtExpiresIn: '1d',
    corsOrigins,
  };
}

module.exports = { getConfig };
