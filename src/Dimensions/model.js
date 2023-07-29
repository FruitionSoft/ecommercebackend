const mongoose = require('mongoose');

const DimensionsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryid: {
        type:[mongoose.Schema.Types.ObjectId],
        required: true,
        ref:'Category'
    },
    shortName: {
        type: String,
        required: true
    },
})



const Dimensions = mongoose.model('Dimensions', DimensionsSchema);
module.exports = Dimensions;