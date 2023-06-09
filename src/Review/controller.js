const {Review} = require('./model');

const getReviewByProductId = async (req, res) => {
    return await Review.find({productId: req.params.id}).populate('userId', 'name').then(response => {
        return res.status(201).send({ success: true, message: '', data: response });
    }).catch(error => {
        return res.status(500).send({ success: false, message: "No data found" });
    })
}

const addNewReview = async(req, res) => {
    const ReviewData = new Review(req.body)
    await ReviewData.save().then(response => {
        return res.status(201).send({success: true, message: 'Data added.'});
    }).catch(err => {
        return res.status(500).send({error: err, success: false})
    })
}

module.exports = {
    getReviewByProductId,
    addNewReview
}