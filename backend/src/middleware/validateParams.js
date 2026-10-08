const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError');

function validateParams(validators) {
  return async (req, _res, next) => {
    try {
      await Promise.all(validators.map((validator) => validator.run(req)));
      const errors = validationResult(req).array();
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

module.exports = { validateParams };
