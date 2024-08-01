const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    type: {
        type: String,
        enum: ['church', 'driver', 'passenger'],
        default: 'passenger',
        required: true,
    },
    password: {
        type: String,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;