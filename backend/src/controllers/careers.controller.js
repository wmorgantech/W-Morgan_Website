const careersService = require('../services/careers.service');

function createCareersController(prisma) {
  return {
    listPublicOpenings: async (_req, res) =>
      res.json(await careersService.listPublicOpenings(prisma)),
    listOpenings: async (_req, res) =>
      res.json(await careersService.listOpenings(prisma)),
    createOpening: async (req, res) =>
      res
        .status(201)
        .json(await careersService.createOpening(prisma, req.body)),
    updateOpening: async (req, res) =>
      res.json(
        await careersService.updateOpening(
          prisma,
          Number(req.params.id),
          req.body,
        ),
      ),
    removeOpening: async (req, res) =>
      res.json(
        await careersService.removeOpening(prisma, Number(req.params.id)),
      ),
    createApplication: async (req, res) =>
      res
        .status(201)
        .json(await careersService.createApplication(prisma, req.body)),
    listApplications: async (_req, res) =>
      res.json(await careersService.listApplications(prisma)),
    updateApplication: async (req, res) =>
      res.json(
        await careersService.updateApplication(
          prisma,
          Number(req.params.id),
          req.body.status,
        ),
      ),
  };
}

module.exports = { createCareersController };
