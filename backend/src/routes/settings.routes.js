const { Router } = require('express');
const adminService = require('../services/admin.service');

function createSettingsRouter(prisma) {
  const router = Router();

  router.get('/public', async (_req, res) => {
    res.json(await adminService.getPublicSettings(prisma));
  });

  return router;
}

module.exports = { createSettingsRouter };
