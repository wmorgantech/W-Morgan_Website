function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err?.code === 'P2002') {
    return res.status(409).json({
      statusCode: 409,
      error: 'Conflict',
      success: false,
      message: 'A record with the same unique value already exists.',
    });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      success: false,
      message: 'Requested record was not found.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const safeStatusCode =
    Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599
      ? statusCode
      : 500;
  const message =
    safeStatusCode === 413
      ? 'Request body is too large.'
      : safeStatusCode === 400 && err.type === 'entity.parse.failed'
        ? 'Invalid JSON request.'
        : safeStatusCode >= 500
          ? 'Internal server error.'
          : err.messages || err.message || 'Something went wrong.';
  const error =
    err.error ||
    (safeStatusCode >= 500
      ? 'Internal Server Error'
      : safeStatusCode === 413
        ? 'Payload Too Large'
        : safeStatusCode === 400
          ? 'Bad Request'
          : safeStatusCode === 429
            ? 'Too Many Requests'
            : 'Request Error');

  return res.status(safeStatusCode).json({
    statusCode: safeStatusCode,
    error,
    success: false,
    message,
  });
}

module.exports = { errorHandler };