const mongoose = require('mongoose');

const DiscountSchema = mongoose.Schema({
    discountValue: {
        type: Number,
        required: true
    },
    discountType: {
        type: String, // "PERCENTAGE", "AMOUNT"
        required: true
    },
    category: {
        type: Array(mongoose.Schema.Types.ObjectId),
        ref: 'Category',
        required: true
    },
    expDate:{
        type: Date, //YYYY-MM-DD
        required: true
    },
    status:{
        type:String,
        default:"ACTIVE" // "ACTIVE", "DEACTIVE"
    }
})

const DiscountData = mongoose.model('Discount', DiscountSchema);
module.exports = DiscountData;