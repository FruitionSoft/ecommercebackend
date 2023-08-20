const mongoose = require('mongoose');

const DeliverySchema = mongoose.Schema({
    fees: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    }
})

const DeliveryData = mongoose.model('Delivery', DeliverySchema);
module.exports = {DeliveryData};