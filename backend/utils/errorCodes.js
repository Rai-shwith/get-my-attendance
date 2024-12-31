const errorCodes = {
    40001: {
        name: 'MissingCredentialError',
        message: 'Missing required fields. Provide all information.',
        statusCode: 400,
    },
    40002: {
        name: 'InvalidInformationError',
        message: 'Invalid email format or password too short.',
        statusCode: 400,
    },
    40003: {
        name: 'WeakPasswordError',
        message: 'Password is too weak. Please use a stronger password.',
        statusCode: 400,
    },
    40004: {
      name: 'InvalidRoleError',
      message: 'Invalid role provided. Only "Teacher" or "student" are allowed.',
      statusCode: 400
    },
    40005: {
      name: 'MissingTokenError',
      message: 'Refresh token is missing. Please provide a valid token.',
      statusCode: 400
    },
    40006: {
      name: 'MissingUserIDError',
      message: 'User ID is missing. Please provide a valid user ID.',
      statusCode: 400
    },
    40007: {
      name: 'MissingUserRoleError',
      message: 'User role is missing. Please provide a valid user role.',
      statusCode: 400
    },
    40008: {
      name: 'MissingExpiryTimeError',
      message: 'Expiry time is missing. Please provide a valid expiry time.',
      statusCode: 400
    },
    40009: {
      name: 'InvalidExpiryTimeError',
      message: 'Expiry time is invalid. It cannot be in the past.',
      statusCode: 400
    },
    40101: {
        name: 'UnauthorizedError',
        message: 'Invalid Credentials.',
        statusCode: 401,
    },
    40102: {
      name: 'InvalidTokenError',
      message: 'The refresh token is invalid or does not match our records.',
      statusCode: 401
    },
    40103: {
      name: 'TokenExpiredError',
      message: 'The refresh token has expired. Please log in again.',
      statusCode: 401
    },
    40104: {
      name: 'TokenRevokedError',
      message: 'The refresh token has been revoked. Please log in again.',
      statusCode: 401
    },
    40301: {
      name: 'ForbiddenError',
      message: 'You do not have permission to access this resource.',
      statusCode: 403
    },
    40401: {
      name: 'EndpointNotFoundError',
      message: 'Cannot find the endpoint',
      statusCode: 404,
    },
    40402: {
      name: 'DepartmentNotFoundError',
      message: 'Department not found',
      statusCode: 404,
    },
    40403: {
      name: 'TeacherNotFoundError',
      message: 'No teacher found for the given ID.',
      statusCode: 404
    },
    40901: {
      name: 'UserAlreadyExistsError',
      message: 'User already exists. Please login.',
      statusCode: 409,
    },
    50001: {
      name: 'InternalServerError',
      message: 'Internal server error. Please try again later.',
      statusCode: 500,
    },
    50002: {
      name: 'DatabaseError',
      message: 'An error occurred while interacting with the database.',
      statusCode: 500,
    },
    50101: {
      name: 'NotImplementedError',
      message: 'This feature is not yet implemented.',
      statusCode: 501,
    },
    // Add more error codes as needed
  };
  
  module.exports = {errorCodes};
  