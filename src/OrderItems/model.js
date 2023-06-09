const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'Products'},
    quantity: {type: Number, required:true}
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;