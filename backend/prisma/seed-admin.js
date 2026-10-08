require('dotenv/config');

const bcrypt = require('bcrypt');
const prisma = require('../src/prisma/client');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the admin account.',
    );
  }
  if (
    password.length < 12 ||
    password.length > 72 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    throw new Error('ADMIN_PASSWORD must be 12 to 72 characters and at most 72 bytes.');
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    console.info('Admin account already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({
    data: { email, name: email.split('@')[0], passwordHash },
  });
  console.info('Initial admin account created.');
}

seedAdmin()
  .catch((error) => {
    console.error('Could not seed the initial admin account.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
