const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: String,
    image: {
        type: Array,
        default: []
    },
    rating: { type: Number, required: true }
})
const Review = mongoose.model('review', reviewSchema)
module.exports = {
    Review
}