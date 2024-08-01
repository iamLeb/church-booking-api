const { errorResponse } = require('../utils/responseHelper');
// validation.js

const validator = require('validator');

// Validate empty fields
const isEmpty = (res, data) => {
    const keys = Object.keys(data);
    for (let key of keys) {
        if (validator.isEmpty(data[key])) {
            errorResponse(res, null, 'All fields are required', 400);
            return false;
        }
    }
};

// Example validation functions
const validateEmail = (res, email, next) => {
    if (!validator.isEmail(email)) {
        errorResponse(res, null, 'You have entered an invalid email address', 400);
        return false;
    }
};

const validatePassword = (res, password) => {
    // Example: Password must be at least 6 characters long
    if (!validator.isStrongPassword(password)) {
        errorResponse(res, null, 'Password must contain special characters and must be at least 6 characters long', 400);
        return false;
    }
};

// Export all validation functions
module.exports = {
    isEmpty,
    validateEmail,
    validatePassword
    // Add more validation functions as needed
};
