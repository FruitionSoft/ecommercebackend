const path = require('path');
const multer = require('multer');

const documentStorage = multer.diskStorage({
    destination: path.join(__dirname, '../assets/products'),
    filename: function (req, file, callback) {
        const image_name = Date.now() + '_' + file.originalname;
        callback(null, image_name);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const uploadProduct = multer({
    storage: documentStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = {
    uploadProduct
};