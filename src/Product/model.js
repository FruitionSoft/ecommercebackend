const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specification: {
        type: String,
        default: ""
    },
    image: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        default: 0
    },
    mrp: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        required: true
    },
    weight: {
        type: Number
    },
    weightType: {
        type: String
    },
    height: {
        type: Number,
        required: true
    },
    whType: {
        type: String,
        default: ""
    },
    deliveryPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    productCreatedDate: {
        type: Date,
        default: Date.now
    },
    productOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessData',
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isPortrait: {
        type: Boolean,
        default: false
    },
    imageType: {
        type: String,
        required: true
    },
    showDimensions: {
        type: Boolean,
        default: false
    },
    showSizeSelection: {
        type: Boolean,
        default: false
    },
    sku: {
        type: String,
        default: ""
    },
    imageCode: String,
    status: {
        type: String,
        default: "PENDING"
    },
    rejectedReason : {
        type: String,
        required: false
    }
})

const Products = mongoose.model('Products', productSchema);
module.exports = Products;