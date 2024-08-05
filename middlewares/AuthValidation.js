const jwt = require('jsonwebtoken');
const Service = require('../helpers/Service');
const { User } = require('../models');

const AuthValidation = async (req, res, next) => {
    try {
        const service = new Service();
        const token = req.query.token;

        if (!token) {
            return res.status(401).json({ message: 'No token found' });
        }

        // validate token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            throw new Error('Invalid Token Provided');
        }

        req.user = await service.getOne(User, decoded._id);

        next();
    } catch (e) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { AuthValidation };
