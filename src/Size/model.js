const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    // width: {
    //     type: Number,
    //     required: true
    // },
    // height: {
    //     type: Number,
    //     required: true
    // },
    // length: {
    //     type: Number,
    //     required: true
    // },
    // size_title: {
    //     type: String,
    //     default: '',
    //     required: true
    // },
    // price: {
    //     type: Number,
    //     default: 0,
    //     required: true
    // },
    // size_type: {
    //     type: String,
    //     required: true
    // },
    // weight: {
    //     type: Number,
    //     default: 0
    // },
    // weight_type: {
    //     type: String,
    //     default: 'KG'
    // }

    width: { // PRODUCT WIDTH DATA HERE
        type: Number,
        required: true
    },
    height: { // PRODUCT HEIGHT DATA HERE
        type: Number,
        required: true
    },
    length: { // PRODUCT LENGTH DATA HERE
        type: Number,
        required: true
    },
    breadth: { // PRODUCT BREADTH DATA HERE
        type: Number,
        required: true
    },
    size_title: { // PRODUCT SIZE TITLE HERE EG. XL, XXL, M, X FOR SHIRTS AND T-SHIRTS
        type: String,
        required: true
    },
    size_category_id: { // THIS IS THE SUB CATEGORY TYPE ID EG. T-SHIRT
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref:'Category'
    }
})

const Size = mongoose.model('Size', sizeSchema);
module.exports = Size;