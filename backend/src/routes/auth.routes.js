const { Router } = require('express');
const {
  createAuthController,
  registerValidation,
  loginValidation,
} = require('../controllers/auth.controller');
const { createRateLimiter } = require('../middleware/rateLimit');

function createAuthRouter(prisma, config) {
  const router = Router();
  const controller = createAuthController(prisma, config);
  const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    message: 'Too many setup attempts. Try again later.',
  });
  const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: 'Too many login attempts. Try again later.',
  });

  router.get('/setup-status', controller.setupStatus);
  router.post(
    '/register',
    registerLimiter,
    registerValidation,
    controller.register,
  );
  router.post('/login', loginLimiter, loginValidation, controller.login);
  return router;
}

module.exports = { createAuthRouter };
