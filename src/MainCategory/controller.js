const MainCategory = require("./model");
const mongoose = require("mongoose");

const addNewMainCategory = async (req, res) => {
  const categoryData = new MainCategory(req.body);
  await categoryData
    .save()
    .then((response) => {
      return res.status(201).send({ success: true, message: "Data added." });
    })
    .catch((err) => {
      return res.status(500).send({ error: err, success: false });
    });
};

const getMainCategoryList = async (req, res) => {
  await MainCategory.find()
    .then((response) => {
      return res
        .status(200)
        .send({ success: true, message: "", data: response });
    })
    .catch((error) => {
      return res.status(500).send({ error: error.message, success: false });
    });
};

const editMainCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(500)
      .send({ error: "Invalid category id", success: false });
  }
  await MainCategory.findByIdAndUpdate(req.params.id, req.body)
    .then((response) => {
      return res.status(200).send({ success: true, message: "Data updated." });
    })
    .catch((err) => {
      return res.status(500).send({ error: err, success: false });
    });
};

const deleteMainCategory = async (req, res) => {
  await MainCategory.findByIdAndDelete(req.params.id)
    .then((response) => {
      if (response) {
        return res
          .status(200)
          .send({ success: true, message: "Data deleted." });
      } else {
        return res
          .status(404)
          .send({ success: false, message: "Category not found" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err, success: false });
    });
};

module.exports = {
  addNewMainCategory,
  getMainCategoryList,
  editMainCategory,
  deleteMainCategory,
};
