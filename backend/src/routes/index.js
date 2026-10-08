const path = require('node:path');
const { Router } = require('express');
const { createHealthRouter } = require('./health.routes');
const { createAuthRouter } = require('./auth.routes');
const { createAdminRouter } = require('./admin.routes');
const { definitions, createContentRouter } = require('./content.routes');
const { createContactRouter } = require('./contact.routes');
const { createCareersRouter } = require('./careers.routes');
const { createSettingsRouter } = require('./settings.routes');
const { createUploadsRouter } = require('./uploads.routes');

function createApiRouter(
  prisma,
  config,
  uploadsDirectory = path.resolve(__dirname, '..', '..', 'uploads'),
) {
  const router = Router();

  router.get('/', (_req, res) => res.send('Hello World!'));
  router.use('/health', createHealthRouter(prisma));
  router.use('/auth', createAuthRouter(prisma, config));
  router.use('/settings', createSettingsRouter(prisma));
  router.use('/admin', createAdminRouter(prisma, config));
  router.use(
    '/uploads',
    createUploadsRouter(prisma, config.jwtSecret, uploadsDirectory),
  );
  router.use('/contact', createContactRouter(prisma, config.jwtSecret));
  router.use('/careers', createCareersRouter(prisma, config.jwtSecret));
  for (const [path, definition] of Object.entries(definitions)) {
    router.use(
      `/${path}`,
      createContentRouter(prisma, definition, config.jwtSecret),
    );
  }

  return router;
}

module.exports = { createApiRouter };
