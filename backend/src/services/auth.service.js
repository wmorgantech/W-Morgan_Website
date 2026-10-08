const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');

async function getSetupStatus(prisma) {
  return { setupRequired: (await prisma.admin.count()) === 0 };
}

async function registerInitialAdmin(
  prisma,
  config,
  { name, email, password, setupCode },
) {
  if (
    !config.adminSetupToken ||
    Buffer.byteLength(config.adminSetupToken) < 32
  ) {
    throw new ApiError(
      503,
      'Initial admin setup is not configured.',
      'Service Unavailable',
    );
  }

  const providedSetupCode = Buffer.from(setupCode);
  const expectedSetupCode = Buffer.from(config.adminSetupToken);
  if (
    providedSetupCode.length !== expectedSetupCode.length ||
    !crypto.timingSafeEqual(providedSetupCode, expectedSetupCode)
  ) {
    throw new ApiError(403, 'Invalid initial setup code.', 'Forbidden');
  }

  if ((await prisma.admin.count()) > 0) {
    throw new ApiError(
      403,
      'Initial admin setup is already complete',
      'Forbidden',
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.$transaction(
    async (transaction) => {
      if ((await transaction.admin.count()) > 0) {
        throw new ApiError(
          403,
          'Initial admin setup is already complete',
          'Forbidden',
        );
      }

      const existingAdmin = await transaction.admin.findUnique({
        where: { email },
      });
      if (existingAdmin) {
        throw new ApiError(
          409,
          'Admin with this email already exists',
          'Conflict',
        );
      }

      const admin = await transaction.admin.create({
        data: { name, email, passwordHash },
      });
      return createSession(admin, config, 'Admin account created');
    },
    { isolationLevel: 'Serializable' },
  );
}

async function loginAdmin(prisma, config, { email, password }) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (
    !admin ||
    !admin.isActive ||
    !(await bcrypt.compare(password, admin.passwordHash))
  ) {
    throw new ApiError(401, 'Invalid email or password', 'Unauthorized');
  }
  return createSession(admin, config, 'Login successful');
}

function createSession(admin, config, message) {
  const accessToken = jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

  return {
    message,
    accessToken,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  };
}

module.exports = { getSetupStatus, registerInitialAdmin, loginAdmin };
