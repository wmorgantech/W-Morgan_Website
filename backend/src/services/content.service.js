const { slugify } = require('../utils/slugify');

async function listPublic(prisma, config) {
  return prisma[config.model].findMany({
    ...(config.publicWhere ? { where: config.publicWhere } : {}),
    orderBy: config.orderBy || { sortOrder: 'asc' },
  });
}

async function listAll(prisma, config) {
  return prisma[config.model].findMany({
    orderBy: config.orderBy || { sortOrder: 'asc' },
  });
}

async function create(prisma, config, dto) {
  const data = { ...dto };
  if (config.slugSource) {
    data.slug = dto.slug?.trim() || slugify(dto[config.slugSource]);
  }
  return prisma[config.model].create({ data });
}

async function update(prisma, config, id, dto) {
  const data = { ...dto };
  if (config.slugSource && dto[config.slugSource] && !dto.slug) {
    data.slug = slugify(dto[config.slugSource]);
  }
  return prisma[config.model].update({ where: { id }, data });
}

async function remove(prisma, config, id) {
  return prisma[config.model].delete({ where: { id } });
}

module.exports = { listPublic, listAll, create, update, remove };
