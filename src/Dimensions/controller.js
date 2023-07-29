const Dimensions = require('./model')
const mongoose = require('mongoose');

const getDimensions= async(req,res)=>{
    const DimensionsList = await Dimensions.find()
    if (!DimensionsList) {
        res.status(500).send({ success: false })
    } else {
        res.status(200).send({ success: true, message: '', data: DimensionsList });
    }
}


const NewDimensions = async(req,res)=>{
    const dimensionsData = new Dimensions(req.body);
    dimensionsData.save().then(data => {
        console.log(data)
        res.status(201).send({ success: true, message: 'Data saved'});
    }).catch(err => {
        res.status(500).send({ error: err, success: false })
    })
}

const getDimensionsById = async(req,res)=>{
    const dimensionsData =await Dimensions.find({_id:req.params.id}).populate('categoryid','name');
    if (!dimensionsData) {
        res.status(500).send({ success: false })
    } else {
        res.status(200).send({ success: true, message: '', data: dimensionsData });
    }
}

const EditDimensions = async(req,res)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid Dimensions id', success: false })
    }
    await Dimensions.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(200).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteDimensions = async (req, res) => {
    await Dimensions.findByIdAndDelete(req.params.id).then(response => {
        if (response) {
            return res.status(200).send({ success: true, message: 'Data deleted.' });
        } else {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

module.exports ={
    getDimensions,
    NewDimensions,
    getDimensionsById,
    EditDimensions,
    deleteDimensions
}