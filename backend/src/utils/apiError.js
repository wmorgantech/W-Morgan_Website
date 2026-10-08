class ApiError extends Error {
  constructor(statusCode, message, error = null) {
    const normalizedMessage = Array.isArray(message)
      ? message.join(' ')
      : message;

    super(normalizedMessage);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.messages = Array.isArray(message) ? message : null;
  }
}

module.exports = { ApiError };