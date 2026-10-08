const { body } = require('express-validator');
const { validateBody } = require('../middleware/validateBody');
const adminService = require('../services/admin.service');

function createAdminController(prisma) {
  return {
    dashboard: async (_req, res) =>
      res.json(await adminService.getDashboardSummary(prisma)),
    getSettings: async (_req, res) =>
      res.json(await adminService.getSettings(prisma)),
    updateSettings: async (req, res) =>
      res.json(await adminService.updateSettings(prisma, req.body)),
  };
}

const settingsFields = [
  'contactEmail',
  'contactPhone',
  'contactLocation',
  'workingHours',
  'logoUrl',
];
const settingsValidation = validateBody(
  [
    body('contactEmail')
      .optional({ values: 'falsy' })
      .isEmail()
      .isLength({ max: 254 })
      .normalizeEmail(),
    body('contactPhone').optional().isString().isLength({ max: 64 }),
    body('contactLocation').optional().isString().isLength({ max: 500 }),
    body('workingHours').optional().isString().isLength({ max: 160 }),
    body('logoUrl').optional().isString().isLength({ max: 2048 }),
  ],
  settingsFields,
);

module.exports = { createAdminController, settingsValidation };
