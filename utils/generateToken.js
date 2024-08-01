const jwt = require('jsonwebtoken');

const generateToken = (res, _id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    // store the token to cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });
    
}

module.exports = { generateToken };