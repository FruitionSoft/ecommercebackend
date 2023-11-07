const { AddressData } = require("./model");
const mongoose = require("mongoose");
const IndianCity = require("../../utils/indianCityList");
const responseHandler = require("../../utils/utils");

const addaddr = async (req, res) => {
  console.log(Object.keys(req.body).length);
  if (Object.keys(req.body).length === 0) {
    responseHandler(
      res,
      400,
      (data = false),
      (customResponse = false),
      "Request body is missing or empty"
    );
  } else {
    const addr = new AddressData(req.body);

    await addr
      .save()
      .then((response) => {
        responseHandler(
          res,
          201,
          (data = false),
          (customResponse = false),
          (message = false)
        );
      })
      .catch((err) => {
        responseHandler(
          res,
          400,
          (data = false),
          (customResponse = false),
          (message = false),
          (err = err)
        );
      });
  }
};

const addrList = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    responseHandler(
      res,
      400,
      (data = false),
      (customResponse = false),
      "Please Check request params id is Valid"
    );
  } else {
    await AddressData.find({ userId: req.params.id })
      .then((response) => {
        responseHandler(
          res,
          200,
          (data = response),
          (customResponse = false),
          (message = false)
        );
      })
      .catch((err) => {
        responseHandler(
          res,
          500,
          (data = false),
          (customResponse = false),
          (message = false),
          (err = err)
        );
      });
  }
};

const addrById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    responseHandler(
      res,
      400,
      (data = false),
      (customResponse = false),
      "Please Check request params id is Valid"
    );
  } else {
    await AddressData.find({ _id: req.params.id })
      .then((response) => {
        if (response.length === 0) {
          return responseHandler(
            res,
            NOTFOUND,
            (data = false),
            (customResponse = false),
            (message = false),
            (err = false)
          );
        } else {
          responseHandler(
            res,
            200,
            (data = response),
            (customResponse = false),
            (message = false)
          );
        }
      })
      .catch((err) => {
        responseHandler(
          res,
          500,
          (data = false),
          (customResponse = false),
          (message = false),
          (err = err)
        );
      });
  }
};

const editAddress = async (req, res) => {
  if (
    !mongoose.isValidObjectId(req.params.id) ||
    Object.keys(req.body).length === 0
  ) {
    responseHandler(
      res,
      400,
      (data = false),
      (customResponse = false),
      `${
        !mongoose.isValidObjectId(req.params.id)
          ? "Please check this is Invalid params id"
          : Object.keys(req.body).length === 0
          ? "Request body data not found"
          : "Something went wrong"
      }`
    );
  } else {
    await AddressData.findByIdAndUpdate(req.params.id, req.body)
      .then((response) => {
        responseHandler(
          res,
          200,
          (data = response),
          (customResponse = false),
          (message = false)
        );
      })
      .catch((err) => {
        responseHandler(
          res,
          500,
          (data = false),
          (customResponse = false),
          (message = false),
          (err = err)
        );
      });
  }
};

const deleteaddr = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    responseHandler(
      res,
      400,
      (data = false),
      (customResponse = false),
      "Please Check request params id is Valid"
    );
  } else {
    await AddressData.findByIdAndDelete({ _id: req.params.id })
      .then((response) => {
        responseHandler(
          res,
          202,
          (data = false),
          (customResponse = false),
          (message = false)
        );
      })
      .catch((err) => {
        responseHandler(
          res,
          500,
          (data = false),
          (customResponse = false),
          (message = false),
          (err = err)
        );
      });
  }
};

const getCityState = async (req, res) => {
  let filterByPin = IndianCity.IndianCity.filter(
    (x) => x.Pincode === req.params.id
  );
  if (filterByPin.length > 0) {
    responseHandler(
      res,
      200,
      (data = filterByPin[0]),
      (customResponse = false),
      (message = false)
    );
  } else {
    responseHandler(
      res,
      404,
      (data = false),
      (customResponse = false),
      "ZIP code not found"
    );
  }
};
module.exports = {
  addaddr,
  addrList,
  deleteaddr,
  editAddress,
  addrById,
  getCityState,
};
