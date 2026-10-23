const { slugify } = require('../utils/slugify');
const { ApiError } = require('../utils/apiError');

async function listPublic(prisma, config) {
  const records = await prisma[config.model].findMany({
    ...(config.publicWhere ? { where: config.publicWhere } : {}),
    orderBy: config.orderBy || { sortOrder: 'asc' },
    ...(config.include ? { include: config.include } : {}),
  });
  return config.transform ? records.map(config.transform) : records;
}

async function getPublic(prisma, config, id) {
  const record = await prisma[config.model].findFirst({
    where: { id, ...(config.publicWhere || {}) },
  });
  if (!record) {
    throw new ApiError(404, 'Requested record was not found.', 'Not Found');
  }
  return record;
}

async function listAll(prisma, config) {
  const records = await prisma[config.model].findMany({
    orderBy: config.orderBy || { sortOrder: 'asc' },
    ...(config.include ? { include: config.include } : {}),
  });
  return config.transform ? records.map(config.transform) : records;
}

async function create(prisma, config, dto) {
  const data = { ...dto };
  if (config.slugSource) {
    data.slug = dto.slug?.trim() || slugify(dto[config.slugSource]);
  }
  const record = await prisma[config.model].create({
    data: config.prepareData ? config.prepareData(data, 'create') : data,
    ...(config.include ? { include: config.include } : {}),
  });
  return config.transform ? config.transform(record) : record;
}

async function update(prisma, config, id, dto) {
  const data = { ...dto };
  if (config.slugSource && dto[config.slugSource] && !dto.slug) {
    data.slug = slugify(dto[config.slugSource]);
  }
  const record = await prisma[config.model].update({
    where: { id },
    data: config.prepareData ? config.prepareData(data, 'update') : data,
    ...(config.include ? { include: config.include } : {}),
  });
  return config.transform ? config.transform(record) : record;
}

async function remove(prisma, config, id) {
  return prisma[config.model].delete({ where: { id } });
}

module.exports = { listPublic, getPublic, listAll, create, update, remove };
