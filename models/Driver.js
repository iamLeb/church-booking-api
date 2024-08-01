const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    churchId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    }

});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;