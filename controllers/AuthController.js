const validation = require('../middlewares/validation');
const Service = require('../helpers/Service');
const { User, Driver, Booking } = require('../models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHelper');

//  @desc       Register User Types
//  @route      POST /auth/register
//  @access     Public 
const register = async (req, res, next) => {
    try {
        const { type } = req.body;

        switch (type) {
            case 'church':
                await church(req, res, next);
                break;
            case 'driver':
                await driver(req, res, next);
                break;
            case 'passenger':
                await passenger(req, res, next);
                break;
            default:
                throw new Error('Invalid registration type');
        }
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
};

//  @desc       Register User Functionality
//  @route      POST /auth/register
//  @access     Public 
const registerUser = async (req, res, requirePassword, additionalData = {}) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        validation.isEmpty(res, { name, email });
        validation.validateEmail(res, email);

        // Password validation if required
        if (requirePassword && (!password || validation.validatePassword(res, password))) {
            errorResponse(res, null, 'Password is required and must meet validation criteria', 400);
            return false;
        }

        // Check if email already exists in the database
        const service = new Service();
        const existingUser = await service.getByField(User, 'email', email);
        if (existingUser) {
            return errorResponse(res, null, 'Account with this email already exists', 400);
        }

        // Hash the password if applicable
        const hashedPassword = requirePassword ? await bcrypt.hash(password, 10) : null;
        req.body.email = req.body.email.toLowerCase();
        // Create user object
        const userData = {
            ...req.body,
            password: hashedPassword,
            ...additionalData
        };

        // Save the user to the database
        const user = await service.create(User, userData);
    
        // Generate token
        if (user && (user.type !== 'passenger')) {
            await generateToken(res, user._id);
        }
        
        return user;

    } catch (error) {
        throw error;
    }
};

//  @desc       Register Churches
//  @route      POST /auth/register
//  @access     Protected 
const church = async (req, res, next) => {
    try {
        const user = await registerUser(req, res, true, { type: 'church' });
        if (!user) {
            return errorResponse(res, null, 'There was an error creating this account', 400);
        }
        return successResponse(res, { user }, 'Church registered successfully');
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
};

//  @desc       Register Drivers
//  @route      POST /auth/register
//  @access     Protected 
const driver = async (req, res, next) => {
    try {
        const { churchId, plateNumber, seats } = req.body;

        if (!plateNumber || !seats) {
            return errorResponse(res, null, 'All fields are required', 400);
        }

        // Verify the church exists
        const service = new Service();
        service.checkId(churchId);
        const church = await service.getByField(User, '_id', churchId);

        // Validate to check if church exists
        if (!church || church.type !== 'church') {
            return errorResponse(res, null, 'Church not found', 404);
        }

        const user = await registerUser(req, res, true, { type: 'driver' });

        // Save the driver to the database
        const driver = await service.create(Driver, {
            userId: user._id,
            churchId: church._id,
            plateNumber,
            seats
        });

        return successResponse(res, { user, driver }, 'Driver registered successfully');
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
};

//  @desc       Register Passengers
//  @route      POST /auth/register
//  @access     Protected 
const passenger = async (req, res, next) => {
    try {
        const service = new Service();
        // Validate the church
        const { churchId } = req.body;
        if (!churchId) return errorResponse(res, null, 'All fields are required', 400);
        await service.checkId(churchId);

        const church = await service.getByField(User, '_id', churchId);

        // Validate to check if church exists
        if (!church || church.type !== 'church') {
            return errorResponse(res, null, 'Church not found', 404);
        }

        const passenger = await registerUser(req, res, false, { type: 'passenger' });
        const booking = await service.create(Booking, {
            userId: passenger._id,
            churchId,
        });

        return successResponse(res, booking, 'Passenger registered successfully');
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
};

//  @desc       Login Users
//  @route      POST /auth/login
//  @access     Public 
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return errorResponse(res, null, 'All fields are required', 400);
        }

        // Check if email exists 
        const service = new Service();
        const user = await service.getByField(User, 'email', email);
        if (!user) {
            return errorResponse(res, null, 'Account Not Found', 404);
        }

        // Compare password 
        if (user && (await bcrypt.compareSync(password, user.password))) {
            // Generate token 
            generateToken(res, user._id);
            return successResponse(res, { user }, 'Login successful');
        } else {
            return errorResponse(res, null, 'Account Not Found', 401);
        }
    } catch (error) {
        next(error);
    }
};

//  @desc       Check Auth
//  @route      GET /auth/check
//  @access     Public 
const check = async (req, res, next) => {
    try {
        return successResponse(res, req.user, 'User authenticated successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    check
};
