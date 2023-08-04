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
        default: 0,
        required: false
    },
    height: { // PRODUCT HEIGHT DATA HERE
        type: Number,
        default: 0,
        required: false
    },
    chest: { // PRODUCT WIDTH DATA HERE
        type: Number,
        default: 0,
        required: false
    },
    shoulder: { // PRODUCT WIDTH DATA HERE
        type: Number,
        default: 0,
        required: false
    },
    length: { // PRODUCT LENGTH DATA HERE
        type: Number,
        default: 0,
        required: false
    },
    breadth: { // PRODUCT BREADTH DATA HERE
        type: Number,
        default: 0,
        required: false
    },
    size_title: { // PRODUCT SIZE TITLE HERE EG. XL, XXL, M, X FOR SHIRTS AND T-SHIRTS
        type: String,
        required: true
    },
    size_type_id:{ //KG ,FEET,INCH
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'Dimensions'
    },
    category_id: { // THIS IS THE SUB CATEGORY TYPE ID EG. T-SHIRT
        type: Array(mongoose.Schema.Types.ObjectId),
        required: true,
        ref:'Category'
    }
})

const Size = mongoose.model('Size', sizeSchema);
module.exports = Size;