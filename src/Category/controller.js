const Category = require('./model');
const mongoose = require('mongoose');
var AWS = require('aws-sdk');
const { response } = require('express');

const getCategoryList = async (req, res) => {
    await Category.find()
    .then(response => {
        return res.status(200).send({ success: true, message: '', data: response });
    }).catch(error => {
        return res.status(500).send({ success: false, error: error.message })
    })
}

const getCategoryListByPID = async (req, res) => {
    await Category.find({parentCategory: req.params.id})
    .then(response => {
        return res.status(200).send({ success: true, message: '', data: response });
    }).catch(error => {
        return res.status(500).send({ success: false, error: error.message })
    })
}

const getDashboarCategory = async (req, res) => {
    const CategoryList = await Category.find().select("-__v").limit(20);
    if (!CategoryList) {
        return res.status(500).send({ success: false })
    } else {
        return res.status(200).send({ success: true, message: '', data: CategoryList });
    }
}

const getCategoryNameList = async (req, res) => {
    const CategoryList = await Category.find().select("name");
    if (!CategoryList) {
        return res.status(500).send({ success: false })
    } else {
        return res.status(200).send({ success: true, message: '', data: CategoryList });
    }
}

const addNewCategory = async (req, res) => {
    const categoryData = new Category(req.body);
    await categoryData.save().then(response => {
        return res.status(201).send({ success: true, message: 'Data added.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const editCategory = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid category id', success: false })
    }
    await Category.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(200).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id).then(response => {
        if (response) {
            return res.status(200).send({ success: true, message: 'Data deleted.' });
        } else {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteImageFromAWS = async (req, res) => {
    try {
        let s3bucket = new AWS.S3({
            accessKeyId: "AKIAWCYLG2EKSGW4QTNB",
            secretAccessKey: "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",
            Bucket: "eashaproductsbucket",
        });
        var params = { Bucket: "eashaproductsbucket", Key: req.body.key };
        s3bucket.deleteObject(params, function (err, data) {
            console.log(err)
            console.log(data)
            if (err) return res.status(500).send({ error: err, success: false, message:"something went wrong" })
            // an error occurred
            else return res.status(200).send({ data: data, success: true })
        });
    } catch (err) {
        return res.status(500).send({ error: err, success: false })
    }
}

module.exports = {
    getCategoryList,
    addNewCategory,
    deleteCategory,
    editCategory,
    getCategoryNameList,
    getDashboarCategory,
    deleteImageFromAWS,
    getCategoryListByPID
};