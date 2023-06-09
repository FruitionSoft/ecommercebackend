const BankData = require('./model');

const getBankDataById = async (req, res) => {
    return await BankData.find({ user_id: req.params.id })
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response });
        }).catch(error => {
            return res.status(500).send({ success: false, message: "No data found", error: error.message });
        })
}

const getPendingBankData = async (req, res) => {
    return await BankData.find({ status: "PENDING" })
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response });
        }).catch(error => {
            return res.status(500).send({ success: false, message: "No data found", error: error.message });
        })
}

const addNewBankDetail = async (req, res) => {
    const BankDetails = new BankData(req.body)
    await BankDetails.save().then(response => {
        return res.status(201).send({ success: true, message: 'Data added.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const updateBankDetail = async (req, res) => {
    await BankData.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(201).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

module.exports = {
    getBankDataById,
    addNewBankDetail,
    updateBankDetail,
    getPendingBankData
}