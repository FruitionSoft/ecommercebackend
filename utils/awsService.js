var AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: "AKIASOJ7RT5H7RY6EXSV",
  secretAccessKey: "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",
});

const uploadImage = async(req, res) => {
    const imagePath = req.files;
    console.log(imagePath)
    // const blob = fs.writeFile(imagePath?.files);
    // const uploadedImage = await s3.upload({
    //     Bucket: "category",
    //     Key: "sample_keyname01",
    //     Body: blob,
    //   }).promise()
    //   console.log(uploadedImage)
    return res.send({success: true, message: "uploadedImage"})
}

module.exports = {
    uploadImage
}