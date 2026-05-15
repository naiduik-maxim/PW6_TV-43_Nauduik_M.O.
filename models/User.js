const mongoose = require('mongoose');

const user =  new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['energy_manager', 'technologist', 'ceo'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', user);