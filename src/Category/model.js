const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  imageCode: { type: String, required: true },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MainCategory",
  },
  description: { type: String, default: "" },
  showDimensions: {
    type: Boolean,
    default: false,
  },
  showSizeSelection: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
