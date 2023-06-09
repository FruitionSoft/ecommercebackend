const mongoose = require('mongoose');

const FavoruitScheme = mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Products'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const FavData = mongoose.model('FavData', FavoruitScheme);
module.exports = {FavData};