const FundData = require('./model');

const getFundData = async (req, res) => {
    return await FundData.find({ user_id: req.params.id })
        .then(response => {
            return res.status(200).send({ success: true, message: '', data: response });
        }).catch(error => {
            return res.status(404).send({ success: false, message: "No data found", error: error.message });
        })
}

const addNewFundDetail = async (req, res) => {
    
    const FundDetails = new FundData(req.body)
    await FundDetails.save().then(response => {
        return res.status(201).send({ success: true, message: 'Data added.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const updateFundDetail = async (req, res) => {
    await FundData.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(200).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const getPendingFundData = async (req, res) => {
    await FundData.find({status: "PENDING"}).populate("user_id","name").then(response => {
        return res.status(200).send({ success: true, message: 'Data updated.', data: response });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false, error: err.message })
    })
}

module.exports = {
    getFundData,
    addNewFundDetail,
    updateFundDetail,
    getPendingFundData
}