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
    imageCode: Array(String),
    status: {
        type: String,
        default: "PENDING"
    },
    rejectedReason : {
        type: String,
        required: false
    },
    size_list:{
        type:Array(mongoose.Schema.Types.ObjectId),
        ref: 'Size',
        required: true
    }
})

const Products = mongoose.model('Products', productSchema);
module.exports = Products;