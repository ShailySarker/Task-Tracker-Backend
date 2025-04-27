const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    const errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            code: statusCode,
            ...(!isProduction && { stack: err.stack }),
        },
    };

    res.status(statusCode).json(errorResponse);
};

class APIError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, APIError, notFound };