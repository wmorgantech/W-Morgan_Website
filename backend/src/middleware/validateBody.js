const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError');

function validateBody(validators, allowedFields) {
  return async (req, _res, next) => {
    try {
      await Promise.all(validators.map((validator) => validator.run(req)));

      const errors = validationResult(req)
        .array()
        .map((error) => ({
          type: error.type,
          location: error.location,
          path: error.path,
          msg: error.msg,
        }));

      for (const field of Object.keys(req.body || {})) {
        if (!allowedFields.includes(field)) {
          errors.push({
            type: 'field',
            location: 'body',
            path: field,
            msg: `Unexpected field: ${field}`,
          });
        }
      }

      if (errors.length) {
        return next(
          new ApiError(
            400,
            errors.map(({ path, msg }) => `${path}: ${msg}`),
            'Bad Request',
          ),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { validateBody };
