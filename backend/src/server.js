const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('node:path');
const { getConfig } = require('./config/env');
const prisma = require('./prisma/client');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { createApiRouter } = require('./routes');

function createApp({
  prismaClient = prisma,
  config = getConfig(),
  uploadsDirectory = path.resolve(__dirname, '..', 'uploads'),
} = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    '/api/uploads',
    express.static(uploadsDirectory, {
      immutable: true,
      maxAge: '1y',
      setHeaders(res, filePath) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (path.extname(filePath).toLowerCase() === '.svg') {
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          );
        }
      },
    }),
  );
  app.use('/api', createApiRouter(prismaClient, config, uploadsDirectory));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  const config = getConfig();
  const app = createApp({ config });
  const server = app.listen(config.port, () => {
    console.info(`API server listening on port ${config.port}`);
  });

  async function shutdown(signal) {
    console.info(`${signal} received; shutting down API server.`);
    server.close(async (error) => {
      if (error) {
        console.error('Could not close API server cleanly.', error);
        process.exitCode = 1;
      }
      await prisma.$disconnect();
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { createApp };
