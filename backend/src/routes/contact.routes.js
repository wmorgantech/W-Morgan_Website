
const { Router } = require('express');
const { body, param } = require('express-validator');

const {
  createContactController,
} = require('../controllers/contact.controller');

const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const { validateBody } = require('../middleware/validateBody');
const { validateParams } = require('../middleware/validateParams');
const { createRateLimiter } = require('../middleware/rateLimit');

// Contact form validation
const createValidation = validateBody(
  [
    // Name - Optional
    body('name')
      .optional({ checkFalsy: true })
      .isString()
      .trim()
      .isLength({ max: 160 }),

    // Email - Optional
    body('email')
      .optional({ checkFalsy: true })
      .isEmail()
      .isLength({ max: 254 })
      .normalizeEmail(),

    // Message - Optional
    body('message')
      .optional({ checkFalsy: true })
      .isString()
      .isLength({ max: 10000 }),

    // Phone - Mandatory
    body('phone')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 64 }),

    // Company - Mandatory
    body('company')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 160 }),

    // Service - Mandatory
    body('service')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 160 }),
  ],
  ['name', 'email', 'message', 'phone', 'company', 'service'],
);

// Status validation
const statusValidation = validateBody(
  [
    body('status').isIn([
      'NEW',
      'IN_PROGRESS',
      'RESPONDED',
      'CLOSED',
    ]),
  ],
  ['status'],
);

// ID validation
const idValidation = validateParams([
  param('id').isInt({ min: 1 }),
]);

function createContactRouter(prisma, jwtSecret) {
  const router = Router();

  const controller = createContactController(prisma);
  const authenticate = createAuthenticateAdmin(prisma, jwtSecret);

  const contactLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many contact submissions. Try again later.',
  });

  // Public contact form submission
  router.post(
    '/',
    contactLimiter,
    createValidation,
    controller.create,
  );

  // Admin routes
  router.get('/manage', authenticate, controller.list);

  router.patch(
    '/:id',
    authenticate,
    idValidation,
    statusValidation,
    controller.updateStatus,
  );

  router.delete(
    '/:id',
    authenticate,
    idValidation,
    controller.remove,
  );

  return router;
}

module.exports = { createContactRouter };
