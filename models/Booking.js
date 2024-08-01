const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
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
    driverId: {
        type: mongoose.Types.ObjectId,
        ref: 'Driver',
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;