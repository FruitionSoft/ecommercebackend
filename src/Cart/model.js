const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Products'
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const CartData = mongoose.model('Cart', CartSchema);
module.exports = {CartData};