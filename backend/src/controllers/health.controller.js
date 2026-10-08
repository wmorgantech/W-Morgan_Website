async function getHealth(prisma) {
  await prisma.$queryRaw`SELECT 1`;
  return { status: 'ok', database: 'connected' };
}

module.exports = { getHealth };
