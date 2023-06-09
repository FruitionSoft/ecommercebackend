const mongoose = require('mongoose');

const BankSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    acc_no: {
        type: Number,
        required: true
    },
    ifsc: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: "PENDING" //PENDING, ACTIVE, REJECTED
    }
})

const BankData = mongoose.model('BankData', BankSchema);
module.exports = BankData;