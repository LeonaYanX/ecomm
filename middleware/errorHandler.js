// Error handler for centralized logging and sending responses
const errorHandler = (err, req, res, next) => {
    
    // Determining the error status (default is 500)
    const status = err.status || 500;

    // Standardized response format
    const errorResponse = {
        status: status,
        error: err.name || 'ServerError',
        message: err.message || 'An internal server error occurred'
    };

    // Error logging
    console.error(`[ERROR] ${err.name}: ${err.message}`);

    // Checking Error types and specifying the response 
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        errorResponse.status = 400;
        errorResponse.message = 'Validation failed: Invalid or duplicate data.';
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        errorResponse.status = 400;
        errorResponse.message = 'Foreign key constraint failed.';
    } else if (err.name === 'JsonWebTokenError') {
        errorResponse.status = 401;
        errorResponse.message = 'Invalid or expired token.';
    } else if (err.name === 'TokenExpiredError') {
        errorResponse.status = 401;
        errorResponse.message = 'Token has expired.';
    } else if (err.name === 'NotFoundError') {
        errorResponse.status = 404;
        errorResponse.message = err.message || 'Resource not found.';
    } else if (err.name === 'ForbiddenError') {
        errorResponse.status = 403;
        errorResponse.message = err.message || 'You do not have permission for this action.';
    }

    res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandler;


