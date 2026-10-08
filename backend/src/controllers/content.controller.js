const contentService = require('../services/content.service');

function createContentController(prisma, config) {
  return {
    listPublic: async (_req, res) =>
      res.json(await contentService.listPublic(prisma, config)),
    listAll: async (_req, res) =>
      res.json(await contentService.listAll(prisma, config)),
    create: async (req, res) =>
      res
        .status(201)
        .json(await contentService.create(prisma, config, req.body)),
    update: async (req, res) =>
      res.json(
        await contentService.update(
          prisma,
          config,
          Number(req.params.id),
          req.body,
        ),
      ),
    remove: async (req, res) =>
      res.json(
        await contentService.remove(prisma, config, Number(req.params.id)),
      ),
  };
}

module.exports = { createContentController };
