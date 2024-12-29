const { errorCodes } = require('./errorCodes');

class AppError extends Error {
  constructor(errorCode) {

    // Get error details from the errorCodes object using the provided errorCode
    const error = errorCodes[errorCode] || errorCodes[50001];  // Default to InternalServerError if code not found

    super(error.message);
    this.name = error.name;
    this.statusCode = error.statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Operational errors: expected errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;