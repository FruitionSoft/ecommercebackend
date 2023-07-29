const { AddressData } = require('./model');
const mongoose =require("mongoose")
const CITY_LIST = require("../../utils/indianCityList.json");

const addaddr = async(req, res) => {
        const addr = new AddressData(req.body);
        await addr.save().then(response => {
            res.status(201).send({success: true, message: 'Data saved.'})
        }).catch(err => {
            res.status(500).send({success: false, message: '', error: err})
        })
}

const addrList = async(req, res) => {
    const addrList = await AddressData.find({userId: req.params.id});
    if(!addrList) {
        res.status(500).send({success: false, message: 'No data found!'})
    }else {
        res.status(200).send({success: true, message: '', data: addrList});
    }
}

const addrById = async(req, res) => {
    const addrList = await AddressData.find({_id: req.params.id});
    if(!addrList) {
        res.status(404).send({success: false, message: 'No data found!'})
    }else {
        res.status(200).send({success: true, message: '', data: addrList[0]});
    }
}

const editAddress = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send({ error: 'Invalid address id', success: false })
    }
    await AddressData.findByIdAndUpdate(req.params.id, req.body ).then(response => {
        return res.status(200).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteaddr = async(req, res) => {
    var query = { '_id': req.params.id };
    try {
        if (!req.params.id) {
          res.status(400).send({ success: false, status: 400, error: 'Bad Request', message: 'Need to pass address id' })
        } else {
            const deleteaddr = await AddressData.findByIdAndDelete(query);
          res.send({ success: true, status: 200, message: 'address deleted successfully' })
        }
      } catch (error) {
        res.status(500).send({ success: false, status: res.status, error: 'Bad Request', message: 'address deletion failed' })
      }
}

const getCityState = async(req, res) => {
    try {
        let filterByPin = CITY_LIST.data.filter(x => x.Pincode === req.params.id);
        if(filterByPin.length > 0) {
            return res.status(200).send({ success: true, status: 200, data: filterByPin[0] });
        }else {
            return res.status(500).send({ success: false, status: 500, message: "ZIP code not found" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, status: res.status, error: 'Bad Request', message: 'address deletion failed' })
      }
}

module.exports = {
    addaddr,
    addrList,
    deleteaddr,
    editAddress,
    addrById,
    getCityState
}