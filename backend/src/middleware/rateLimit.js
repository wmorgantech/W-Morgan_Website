const { rateLimit } = require('express-rate-limit');

function createRateLimiter({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        success: false,
        message,
      }),
  });
}

module.exports = { createRateLimiter };
