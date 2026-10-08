const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');

function createAuthenticateAdmin(prisma, jwtSecret) {
  return async (req, _res, next) => {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(
        new ApiError(401, 'Authentication required.', 'Unauthorized'),
      );
    }

    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch {
      return next(
        new ApiError(401, 'Invalid or expired access token.', 'Unauthorized'),
      );
    }

    if (!payload || !Number.isInteger(payload.sub)) {
      return next(new ApiError(401, 'Invalid access token.', 'Unauthorized'));
    }

    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, isActive: true },
    });
    if (!admin || !admin.isActive) {
      return next(
        new ApiError(
          401,
          'Admin account is inactive or unavailable.',
          'Unauthorized',
        ),
      );
    }

    req.admin = { id: admin.id, name: admin.name, email: admin.email };
    return next();
  };
}

module.exports = { createAuthenticateAdmin };
