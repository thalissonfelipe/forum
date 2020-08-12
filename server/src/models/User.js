const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    name: {
        type: String,
        required: [true, 'Missing name field']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Missing username field']
    },
    password: {
        type: String,
        required: [true, 'Missing password field']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Missing email field']
    },
    phone: {
        type: String,
        required: [true, 'Missing phone field']
    },
    registry: {
        type: Number,
        unique: true,
        required: [true, 'Missing registry field']
    },
    profile: {
        type: String,
        unique: true,
        default: 'common'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    course: {
        type: String,
        required: [true, 'Missing course field']
    },
    semester: {
        type: Number,
        required: [true, 'Missing semester field']
    }

});

module.exports = mongoose.model('User', UserSchema);
