const Discount = require("./model");
const mongoose = require("mongoose");
const schedule = require("node-schedule");

const getDiscount = async (req, res) => {
  //ACTIVE=true , CATEGORY=true
  //ACTIVE=false , CATEGORY=false
  //ACTIVE=false , CATEGORY=true
  //ACTIVE=true , CATEGORY=false

  let DiscountList;
  console.log("active", req.query.active, "Category", req.query.category);

  switch (req.query.active) {
    case "ACTIVE":
      if (req.query.category === "true") {
        DiscountList = await Discount.find({ status: "ACTIVE" }).populate(
          "category"
        );
      } else {
        DiscountList = await Discount.find({ status: "ACTIVE" });
      }
      break;
    case "DEACTIVE":
      if (req.query.category === "true") {
        DiscountList = await Discount.find({ status: "DEACTIVE" }).populate(
          "category"
        );
      } else {
        DiscountList = await Discount.find({ status: "DEACTIVE" });
      }
      break;
    default:
      DiscountList = await Discount.find({ status: "ACTIVE" });
      break;
  }

  if (await DiscountList) {
    res.status(200).send({ success: true, message: "", data: DiscountList });
  } else {
    res.status(500).send({ success: false });
  }
};

const NewDiscount = async (req, res) => {
  console.log(req.body);
  const discountList = new Discount(req.body);
  discountList
    .save()
    .then((data) => {
      res.status(201).send({ success: true, message: "Data saved" });
    })
    .catch((err) => {
      res.status(500).send({ error: err, success: false });
    });
};

const getDiscountByID = async (req, res) => {
  console.log(req.params.id);
  const discountData = await Discount.find({ _id: req.params.id }).populate({
    path: "category",
    select: "name",
    populate: { path: "parentCategory", select: "name" },
  });

  if (!discountData) {
    res.status(500).send({ success: false });
  } else {
    res.status(200).send({ success: true, message: "", data: discountData });
  }
};

const editDiscount = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(500)
      .send({ error: "Invalid Discount id", success: false });
  }
  await Discount.findByIdAndUpdate(req.params.id, req.body)
    .then((response) => {
      return res.status(200).send({ success: true, message: "Data updated." });
    })
    .catch((err) => {
      return res.status(500).send({ error: err, success: false });
    });
};

const deleteDiscount = async (req, res) => {
  await Discount.findByIdAndDelete(req.params.id)
    .then((response) => {
      if (response) {
        return res
          .status(200)
          .send({ success: true, message: "Data deleted." });
      } else {
        return res
          .status(404)
          .send({ success: false, message: "Product not found" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err, success: false });
    });
};

module.exports = {
  getDiscount,
  NewDiscount,
  getDiscountByID,
  editDiscount,
  deleteDiscount,
};
