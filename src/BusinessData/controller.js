const Business = require('./model');
const mongoose = require('mongoose');

const newBusinessData = async (req, res) => {
    try {
        const BusinessData = new Business(req.body);
        return BusinessData.save().then(data => {
            return res.status(201).send({ success: true, message: 'Data saved.', data: data });
        }).catch(err => {
            return res.status(500).send({ success: false, message: err.message })
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const getShopList = async (req, res) => {
    await Business.find({userId: req.params.id}).populate('userId', 'name').then(response => {
        return res.status(201).send({ success: true, message: '', data: response });
    }).catch(error => {
        return res.status(500).send({ success: false, message: error.message })
    })
}

const deleteShop = async (req, res) => {
    await Business.findByIdAndDelete(req.params.id).then(response => {
        if (response) {
            return res.status(201).send({ success: true, message: 'Data deleted.' });
        } else {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(500).send({ error: err.message, success: false })
    })
}

const getShopById = async (req, res) => {
    await Business.find({ _id: req.params.id }).then(response => {
        return res.status(201).send({ success: true, message: '', data: response });
    }).catch(error => {
        return res.status(500).send({ success: false, message: error.message })
    })
}

const updateShop = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid product id', success: false })
    }
    await Business.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(201).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err.message, success: false })
    })
}

module.exports = {
    newBusinessData,
    getShopList,
    deleteShop,
    getShopById,
    updateShop
};