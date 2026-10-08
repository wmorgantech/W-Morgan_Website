const contactService = require('../services/contact.service');

function createContactController(prisma) {
  return {
    create: async (req, res) =>
      res
        .status(201)
        .json(await contactService.createInquiry(prisma, req.body)),
    list: async (_req, res) =>
      res.json(await contactService.listInquiries(prisma)),
    updateStatus: async (req, res) =>
      res.json(
        await contactService.updateInquiryStatus(
          prisma,
          Number(req.params.id),
          req.body.status,
        ),
      ),
  };
}

module.exports = { createContactController };
