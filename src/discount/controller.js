const Discount = require("./model");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const moment = require("moment");
const mail = require("../../services/mail");
const currentDate = moment();

const getDiscount = async (req, res) => {
  let DiscountList;
  DiscountList = await Discount.find();
  if (await DiscountList) {
    res.status(200).send({ success: true, message: "", data: DiscountList });
  } else {
    res.status(500).send({ success: false });
  }
};

const NewDiscount = async (req, res) => {
  const discountList = new Discount(req.body);
  discountList
    .save()
    .then((data) => {
      console.log(data);
      const job = schedule.scheduleJob(req.body.expDate, () => {
        console.log(
          "Task executed at the specific date and time.",
          req.body.expDate
        );
        deleteDiscountCron(data._id, req.body.name);
      });

      job.on("run", function () {
        console.log("Job executed.");
      });
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

const deleteDiscountCron = async (id, name) => {
  const { discountDeletedMsg } = mail;
  await Discount.findByIdAndDelete(id)
    .then((response) => {
      if (response) {
        return discountDeletedMsg(
          `Hello Admins, This ${name} discount expired`
        );
      } else {
        return discountDeletedMsg("Something went wrong in discount expire");
      }
    })
    .catch((err) => {
      return discountDeletedMsg(req, res);
    });
};

module.exports = {
  getDiscount,
  NewDiscount,
  getDiscountByID,
  editDiscount,
  deleteDiscount,
};
