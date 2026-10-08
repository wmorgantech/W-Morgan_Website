const { body } = require('express-validator');
const { validateBody } = require('../middleware/validateBody');
const authService = require('../services/auth.service');

function createAuthController(prisma, config) {
  return {
    setupStatus: async (_req, res) =>
      res.json(await authService.getSetupStatus(prisma)),

    register: async (req, res) =>
      res
        .status(201)
        .json(await authService.registerInitialAdmin(prisma, config, req.body)),

    login: async (req, res) =>
      res.json(await authService.loginAdmin(prisma, config, req.body)),
  };
}

const registerValidation = validateBody(
  [
    body('name').isString().trim().isLength({ min: 1, max: 160 }),
    body('email').isEmail().isLength({ max: 254 }).normalizeEmail(),
    body('password')
      .isString()
      .isLength({ min: 12, max: 72 })
      .custom((value) => Buffer.byteLength(value, 'utf8') <= 72),
    body('setupCode').isString().isLength({ min: 32, max: 256 }),
  ],
  ['name', 'email', 'password', 'setupCode'],
);

const loginValidation = validateBody(
  [
    body('email').isEmail().isLength({ max: 254 }).normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 72 }),
  ],
  ['email', 'password'],
);

module.exports = {
  createAuthController,
  registerValidation,
  loginValidation,
};
