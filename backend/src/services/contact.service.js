async function createInquiry(prisma, dto) {
  return prisma.contactInquiry.create({
    data: { ...dto, email: dto.email.toLowerCase().trim() },
  });
}

async function listInquiries(prisma) {
  return prisma.contactInquiry.findMany({ orderBy: { createdAt: 'desc' } });
}

async function updateInquiryStatus(prisma, id, status) {
  return prisma.contactInquiry.update({ where: { id }, data: { status } });
}

module.exports = { createInquiry, listInquiries, updateInquiryStatus };
