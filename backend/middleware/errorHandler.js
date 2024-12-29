const errorHandler = (err, req, res, next) => {
    // Default error values
    const errorName = err.name || "Internal Server Error";
    const statusCode = err.statusCode || 500;
    const errorCode = err.errorCode || null;
  
    // Send error response
    res.status(statusCode).json({
      success: false,
      error: {
        name : errorName,
        code: errorCode,
        message: err.message || "Internal Server Error"
      }
    });
  };
  
  module.exports = errorHandler;
  