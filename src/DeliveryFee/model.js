const mongoose = require('mongoose');

const DeliverySchema = mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    TN: {
        type: Number,
        default: 0
    },
    NI: {
        type: Number,
        default: 0
    }
})

const DeliveryData = mongoose.model('Delivery', DeliverySchema);
module.exports = {DeliveryData};