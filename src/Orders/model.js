const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: Array({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }),
    addressId: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
    phone: String,
    status: {type:String, default: 'PENDING'},
    totalPrice: {type: Number, required: true},
    subTotal: {type: Number, required: true},
    rating: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deliveryPrice: {type: Number, required: true},
    amountPaid: {type: Number},
    amountDue: {type: Number},
    processImage: [{type: String}],
    dateOrdered: {type: Date, default: Date.now},
    expDelDate: {type: Date},
    productOwner: Array(mongoose.Schema.Types.ObjectId),
    orderId: {type: String, required: true},
    orderIdFromApp: {type: String, required: true},
    trackId: {type: String},
    deliveryDate: {type: Date},
    payment_details: {type: Object}
})

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;