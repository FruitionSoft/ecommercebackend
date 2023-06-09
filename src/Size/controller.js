const Size = require('./model');
const mongoose = require('mongoose');

const newSize = (req, res) => {
    const sizeData = new Size(req.body);
    sizeData.save().then(data => {
        res.status(201).send({ success: true, message: 'Data saved'});
    }).catch(err => {
        res.status(500).send({ error: err, success: false })
    })
}

const getSizeList = async (req, res) => {
    const SizeList = await Size.find();
    if (!SizeList) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', data: SizeList });
    }
}

const getSizeById = async (req, res) => {
    const sizeList = await Size.find({ _id: req.params.id });
    if (!sizeList) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', data: sizeList });
    }
}

const editSize = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid size id', success: false })
    }
    await Size.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(201).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteSize = async (req, res) => {
    await Size.findByIdAndDelete(req.params.id).then(response => {
        if (response) {
            return res.status(201).send({ success: true, message: 'Data deleted.' });
        } else {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

module.exports = {
    newSize,
    getSizeList,
    getSizeById,
    editSize,
    deleteSize
}