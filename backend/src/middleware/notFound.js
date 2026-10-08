function notFound(req, res) {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    success: false,
    message: 'Route not found.',
  });
}

module.exports = { notFound };