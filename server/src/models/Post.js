const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title missing']
    },
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    body: {
        type: String,
        required: [true, 'Body missing']
    }
});
module.exports = mongoose.model('Post', postSchema);
