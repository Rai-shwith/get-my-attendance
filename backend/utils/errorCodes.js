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
    40101: {
        name: 'UnauthorizedError',
        message: 'Unauthorized access.',
        statusCode: 401,
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
      message: 'Database error. Please try again later.',
      statusCode: 500,
    },
    50101: {
      name: 'NotImplementedError',
      message: 'This feature is not yet implemented.',
      statusCode: 501,
    },
    // Add more error codes as needed
  };
  
  module.exports = errorCodes;
  