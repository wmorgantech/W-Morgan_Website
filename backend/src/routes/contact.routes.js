const { Router } = require('express');
const { body, param } = require('express-validator');
const {
  createContactController,
} = require('../controllers/contact.controller');
const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const { validateBody } = require('../middleware/validateBody');
const { validateParams } = require('../middleware/validateParams');
const { createRateLimiter } = require('../middleware/rateLimit');

const createValidation = validateBody(
  [
    body('name').isString().trim().isLength({ min: 1, max: 160 }),
    body('email').isEmail().isLength({ max: 254 }).normalizeEmail(),
    body('message').isString().trim().isLength({ min: 1, max: 10000 }),
    body('phone').optional().isString().isLength({ max: 64 }),
    body('company').optional().isString().isLength({ max: 160 }),
    body('service').optional().isString().isLength({ max: 160 }),
  ],
  ['name', 'email', 'message', 'phone', 'company', 'service'],
);
const statusValidation = validateBody(
  [body('status').isIn(['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'])],
  ['status'],
);
const idValidation = validateParams([param('id').isInt({ min: 1 })]);

function createContactRouter(prisma, jwtSecret) {
  const router = Router();
  const controller = createContactController(prisma);
  const authenticate = createAuthenticateAdmin(prisma, jwtSecret);
  const contactLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many contact submissions. Try again later.',
  });

  router.post('/', contactLimiter, createValidation, controller.create);
  router.get('/manage', authenticate, controller.list);
  router.patch(
    '/:id',
    authenticate,
    idValidation,
    statusValidation,
    controller.updateStatus,
  );
  return router;
}

module.exports = { createContactRouter };
