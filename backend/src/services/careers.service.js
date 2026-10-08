const { slugify } = require('../utils/slugify');
const { ApiError } = require('../utils/apiError');

const jobOpeningStatuses = ['OPEN', 'CLOSED', 'DRAFT'];
const employmentTypes = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'FREELANCE',
];
const jobApplicationStatuses = [
  'RECEIVED',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
];

async function listPublicOpenings(prisma) {
  return prisma.jobOpening.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });
}

async function listOpenings(prisma) {
  return prisma.jobOpening.findMany({ orderBy: { createdAt: 'desc' } });
}

async function createOpening(prisma, dto) {
  const slug = dto.slug?.trim() || slugify(dto.jobTitle);
  return prisma.jobOpening.create({ data: { ...dto, slug } });
}

async function updateOpening(prisma, id, dto) {
  const data = { ...dto };
  if (dto.jobTitle && !dto.slug) data.slug = slugify(dto.jobTitle);
  return prisma.jobOpening.update({ where: { id }, data });
}

async function removeOpening(prisma, id) {
  const applicationCount = await prisma.jobApplication.count({
    where: { jobOpeningId: id },
  });
  if (applicationCount > 0) {
    throw new ApiError(
      409,
      'This opening has applications and cannot be deleted. Close it instead.',
      'Conflict',
    );
  }
  return prisma.jobOpening.delete({ where: { id } });
}

async function createApplication(prisma, dto) {
  const opening = await prisma.jobOpening.findUnique({
    where: { id: dto.jobOpeningId },
    select: { status: true },
  });
  if (!opening) {
    throw new ApiError(404, 'Job opening was not found.', 'Not Found');
  }
  if (opening.status !== 'OPEN') {
    throw new ApiError(
      409,
      'Applications are accepted only for open job openings.',
      'Conflict',
    );
  }
  return prisma.jobApplication.create({ data: dto });
}

async function listApplications(prisma) {
  return prisma.jobApplication.findMany({
    include: { jobOpening: { select: { jobTitle: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function updateApplication(prisma, id, status) {
  return prisma.jobApplication.update({ where: { id }, data: { status } });
}

module.exports = {
  jobOpeningStatuses,
  employmentTypes,
  jobApplicationStatuses,
  listPublicOpenings,
  listOpenings,
  createOpening,
  updateOpening,
  removeOpening,
  createApplication,
  listApplications,
  updateApplication,
};
