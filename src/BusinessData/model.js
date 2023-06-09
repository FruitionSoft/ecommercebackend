const mongoose = require('mongoose');

const Businessscheme = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    shopName: {type: String, required: true},
    shopAddress: {type: String, required: true},
    shopCity: {type: String, required: true},
    shopState: {type: String, required: true},
    shopCountry: {type: String, required: true},
    shopPhone: {type: Number, required: true},
    shopDoorNo: {type: Number, required: true},
    shopZipCode: {type: Number, required: true},
    countryCode: {type: String, required: true},
    shopAdditionalPhone: {type: Number},
    shopStatus: {type: String, required: true},
    gst: {type: String}
})

const Business = mongoose.model('BusinessData', Businessscheme);
module.exports = Business;