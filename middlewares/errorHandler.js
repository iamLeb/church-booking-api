// middlewares/errorHandler.js

const { errorResponse } = require('../utils/responseHelper');

const errorHandler = (err, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return errorResponse(res, err, message, statusCode);
};

module.exports = errorHandler;
