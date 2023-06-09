const mongoose = require('mongoose');

const FundSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        default: "PENDING" //PENDING, DONE, REJECTED
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const FundData = mongoose.model('Fund', FundSchema);
module.exports = FundData;