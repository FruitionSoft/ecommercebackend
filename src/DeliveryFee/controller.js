const { DeliveryData } = require('./model');
const mongoose = require("mongoose");
const {countryList} = require("../../clist");

const addDelv = async(req, res) => {
        const Delv = new DeliveryData(req.body);
        await Delv.save().then(response => {
            res.status(200).send({success: true, message: 'Data saved.'})
        }).catch(err => {
            res.status(500).send({success: false, message: '', error: err})
        })
}

const DelvList = async(req, res) => {
    const DelvList = await DeliveryData.find({country: req.params.id});
    if(!DelvList) {
        res.status(500).send({success: false, message: 'No data found!'})
    }else {
        res.status(201).send({success: true, message: '', data: DelvList});
    }
}

const DelvListAll = async(req, res) => {
    const DelvList = await DeliveryData.find();
    if(!DelvList) {
        res.status(500).send({success: false, message: 'No data found!'})
    }else {
        res.status(201).send({success: true, message: '', data: DelvList});
    }
}

const editDelv = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid address id', success: false })
    }
    await DeliveryData.findByIdAndUpdate(req.params.id, req.body ).then(response => {
        return res.status(201).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteAllList = async (req, res) => {
    await DeliveryData.deleteMany({});
}
module.exports = {
    addDelv,
    DelvList,
    editDelv,
    DelvListAll,
    deleteAllList
}