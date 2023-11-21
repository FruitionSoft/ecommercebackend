const { CartData } = require("./model");

const addCart = async (req, res) => {
  const Cart = new CartData(req.body);
  await Cart.save()
    .then((response) => {
      return res.status(201).send({ success: true, message: "Data saved." });
    })
    .catch((error) => {
      console.log(error.message);
      return res
        .status(500)
        .send({ success: false, message: "", error: error.message });
    });
};

const editCart = async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({
        success: false,
        status: 400,
        error: "Bad Request",
        message: "Need to pass Cart id as Params",
      });
    } else {
      await CartData.findByIdAndUpdate(req.params.id, req.body).then(
        (response) => {
          return res.send({
            success: true,
            status: 200,
            message: "Cart Updated Successfully",
          });
        }
      );
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      status: res.status,
      error: "Bad Request",
      message: "Error While on Cart Update",
    });
  }
};

const CartList = async (req, res) => {
  const CartList = await CartData.find({ userId: req.params.id });
  if (!CartList) {
    res.status(500).send({ success: false, message: "No data found!" });
  } else {
    res.status(200).send({ success: true, message: "", data: CartList });
  }
};

const CartProductList = async (req, res) => {
  const CartList = await CartData.find({ userId: req.params.id }).populate(
    "itemId"
  );
  if (!CartList) {
    res.status(500).send({ success: false, message: "No data found!" });
  } else {
    res.status(200).send({ success: true, message: "", data: CartList });
  }
};

const deleteCartProduct = async (req, res) => {
  var query = { _id: req.params.id };
  try {
    if (!req.params.id) {
      res.status(400).send({
        success: false,
        status: 400,
        error: "Bad Request",
        message: "Need to pass Product id",
      });
    } else {
      const deleteCart = await CartData.findByIdAndDelete(query);
      res.send({
        success: true,
        status: 200,
        message: "Product deleted successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      status: res.status,
      error: "Bad Request",
      message: "Product deletion failed",
    });
  }
};

const deleteCartByUser = async (req, res) => {
  var query = { userId: req.params.id };
  try {
    if (!req.params.id) {
      res.status(400).send({
        success: false,
        status: 400,
        error: "Bad Request",
        message: "Need to pass Product id",
      });
    } else {
      const deleteCart = await CartData.deleteMany(query);
      res.send({
        success: true,
        status: 200,
        message: "Product deleted successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      status: res.status,
      error: "Bad Request",
      message: "Product deletion failed",
    });
  }
};

const decreaseCartItem = async (req, res) => {
  await CartData.updateOne({ _id: req.params.id }, { $inc: { quantity: -1 } })
    .then((response) => {
      res.status(200).send({ success: true, message: "", data: response });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ success: false, message: "", error: error.message });
    });
};

const increaseCartItem = async (req, res) => {
  await CartData.updateOne({ _id: req.params.id }, { $inc: { quantity: 1 } })
    .then((response) => {
      res.status(200).send({ success: true, message: "", data: response });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ success: false, message: "", error: error.message });
    });
};

module.exports = {
  addCart,
  editCart,
  CartList,
  deleteCartProduct,
  CartProductList,
  deleteCartByUser,
  increaseCartItem,
  decreaseCartItem,
};
