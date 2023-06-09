const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    messages: {
        type: Array
    },
    status: {
        type: String, // ACTIVE, INACTIVE
        required: true
    }
})

const ChatData = mongoose.model('Chat', ChatSchema);
module.exports = {ChatData};