const { Router } = require('express');
const { getHealth } = require('../controllers/health.controller');

function createHealthRouter(prisma) {
  const router = Router();
  router.get('/', async (_req, res) => {
    res.json(await getHealth(prisma));
  });
  return router;
}

module.exports = { createHealthRouter };
