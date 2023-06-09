const mongoose = require('mongoose');

const mainCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);
module.exports = MainCategory;