const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    houseNo: {
        type: Number,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    area: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const AddressData = mongoose.model('Address', AddressSchema);
module.exports = {AddressData};