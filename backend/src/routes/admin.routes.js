const { Router } = require('express');
const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const {
  createAdminController,
  settingsValidation,
} = require('../controllers/admin.controller');

function createAdminRouter(prisma, config) {
  const router = Router();
  const controller = createAdminController(prisma);
  router.use(createAuthenticateAdmin(prisma, config.jwtSecret));
  router.get('/dashboard', controller.dashboard);
  router.get('/settings', controller.getSettings);
  router.put('/settings', settingsValidation, controller.updateSettings);
  return router;
}

module.exports = { createAdminRouter };
