const mongoose = require('mongoose');

const mainCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryTypeId: {
        type: Number,
        default: 1
    }
})

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);
module.exports = MainCategory;