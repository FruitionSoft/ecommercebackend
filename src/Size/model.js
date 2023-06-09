const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    size_title: {
        type: String,
        default: '',
        required: true
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    size_type: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        default: 0
    },
    weight_type: {
        type: String,
        default: 'KG'
    }
})

const Size = mongoose.model('Size', sizeSchema);
module.exports = Size;