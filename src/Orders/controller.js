const Order = require('./model');
const OrderItem = require('../OrderItems/model');
const Product = require('../Product/model');
const mongoose = require('mongoose');
const moment = require("moment");
const { getPaytmToken } = require('../services/paytmToken');

const getOrderList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalCount = await Order.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    try {
        const controllerList = await Order.find()
            .populate({
                path: 'orderItems',
                populate: { path: 'product' }
            })
            .populate('user', 'name').sort({ 'dateOrdered': -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec()
        if (!controllerList) {
            return res.status(500).send({ success: false })
        } else {
            return res.status(200).send({ success: true, message: '', data: controllerList, 
            pagination: {
                totalProducts: totalCount,
                totalPages: totalPages,
                currentPage: page,
              } });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Bad request" })
    }
}

const getOrderListByDate = async (req,res)=>{
    query = {
        dateOrdered: { $gte: req.body.from, $lt: req.body.to },
      };
    try{
        const orderList = await Order.find(query)
        .populate({
            path: 'orderItems',
            populate: { path: 'product' }
        })
        .populate('user', 'name').sort({ 'dateOrdered': -1 })
        console.log(orderList.length)

        if(!orderList){
            return res.status(500).send({ success: false })
        }else{
            return res.status(200).send({ success: true, message: '', data: orderList,count:orderList.length})
        }
    }
    catch{
        return res.status(403).send({ success: false, message: "Bad request" })
    }
        
}
const getOrderSales = async (req, res) => {
    try {
        const orderAnalytics = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ]);
        const orderCount = await Order.countDocuments()
        if (!orderAnalytics) {
            res.status(500).send({ success: false })
        } else {
            res.status(200).send({ success: true, message: '', totalPrice: orderAnalytics.pop().totalsales, totalOrder: orderCount });
        }
    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
}

const getOrderByOrderId = async (req, res) => {
    console.log(req.params.id)
    try {
        console.log('done')
        await Order.find({ orderId: req.params.id })
            .populate('user', 'name token')
            .populate({ path: 'orderItems', populate: { path: 'product' } }).populate({ path: "addressId" })
            .then(response => {
                console.log(response)
                return res.status(200).send({ success: true, message: '', data: response[0] });
            }).catch(error => {
                res.status(500).send({ success: false, error: error.message })
            })
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

const getOrderById = async (req, res) => {
    try {
        console.log('here')
        await Order.find({ _id: req.params.id })
            .populate('user', 'name token')
            .populate({ path: 'orderItems', populate: { path: 'product' } }).populate({ path: "addressId" })
            .then(response => {
                return res.status(200).send({ success: true, message: '', data: response[0] });
            }).catch(error => {
                res.status(500).send({ success: false, error: error.message })
            })
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

const orderPending = async (req, res) => {
    try {
        const orderDetails = await Order.find({ productOwner: req.params.id, "status": { $nin: [ "PENDING", "DELIVERED" ] } }).populate('user', 'name country_code token').populate({
            path: 'orderItems',
            populate: [{ path: 'product' }]
        }).sort({ 'dateOrdered': -1 })
        if (!orderDetails) {
            res.status(500).send({ success: false })
        } else {
            res.status(200).send({ success: true, message: '', data: orderDetails });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

const orderDelivered = async (req, res) => {
    try {
        const orderDetails = await Order.find({ productOwner: req.params.id, "status": "DELIVERED" }).populate('user', 'name country_code').populate({
            path: 'orderItems',
            populate: { path: 'product' }
        }).sort({ 'dateOrdered': -1 })
        if (!orderDetails) {
            res.status(500).send({ success: false })
        } else {
            res.status(200).send({ success: true, message: '', data: orderDetails });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}


const getOrderByUserId = async (req, res) => {
    try {
        await Order.find({ user: req.params.id, "status": { $ne: "PENDING" } }).sort({ "dateOrdered": -1 })
            .populate({
                path: 'orderItems', populate: { path: 'product' }
            })
            .populate('user', 'name')
            .then(response => {
                return res.status(200).send({ success: true, message: '', data: response });
            }).catch(error => {
                res.status(500).send({ success: false, error: error.message })
            })
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

const editOrderStatus = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).send({ error: 'Invalid order id', success: false })
        }
        await Order.findByIdAndUpdate(req.params.id, req.body).then(response => {
            return res.status(200).send({ success: true, message: 'Data updated.' });
        }).catch(err => {
            return res.status(500).send({ error: err, success: false })
        })
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

const deleteOrder = async (req, res) => {
    try {
        let OrderDetails = await Order.findById(req.params.id);
        if (!OrderDetails) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        } else {
            OrderDetails.orderItems.map(async item => {
                await OrderItem.findByIdAndDelete(item);
            })
            await Order.findByIdAndDelete(req.params.id).then(response => {
                if (response) {
                    return res.status(200).send({ success: true, message: 'Data deleted.' });
                } else {
                    return res.status(404).send({ success: false, message: 'Order not found' });
                }
            }).catch(err => {
                return res.status(500).send({ error: err, success: false })
            })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}
const addNumbers=(a, b) =>{
    return a + b;
  }

  function responseHandler(res, code, data, customResponse, message, err, token) {
    switch (code) {
      case 200:
        res.status(200).send({
          success: true,
          message: message ? message : "Data updated successfully",
          data: data ? data : undefined,
          Pagination: customResponse ? customResponse : undefined,
          token: token ? token : undefined,
        });
        break;
      case 201:
        res.status(201).send({
          success: true,
          message: message ? message : "Data Created successfully",
          data: data ? data : undefined,
          Pagination: customResponse ? customResponse : undefined,
        });
        break;
      case 202:
        res.status(202).send({
          success: true,
          message: message ? message : "Data Deleted successfully",
          data: data ? data : undefined,
          Pagination: customResponse ? customResponse : undefined,
        });
        break;
      case 404:
        res.status(404).send({
          success: false,
          message: message ? message : "No data found!",
          data: data ? data : [],
          Pagination: customResponse ? customResponse : undefined,
          error: err ? err : undefined,
        });
        break;
      case 400:
        res.status(400).send({
          success: false,
          message: message ? message : "Bad Request",
          data: data ? data : undefined,
          Pagination: customResponse ? customResponse : undefined,
          error: err ? err : undefined,
        });
        break;
      case 403:
        res.status(403).send({
          success: false,
          message: message ? message : "Forbidden",
          data: data ? data : undefined,
          Pagination: customResponse ? customResponse : undefined,
          error: err ? err : undefined,
        });
        break;
      default:
        console.log(err);
        if (err?.name === "ValidationError") {
          res.status(400).send({
            success: false,
            message: `Please ensure this fields in the request body (${Object.keys(
              err?.errors
            )}),It is a required field`,
          });
        } else if (err?.name === "CastError") {
          res.status(400).send({
            success: false,
            message: "Invalid data type",
            details:
              "One or more fields in the request contain data that cannot be cast to the expected data type. Check the data you are sending and ensure it matches the schema requirements.",
          });
        } else {
          res.status(500).send({
            success: false,
            message: message ? message : "Internal Server Error",
            err: err ? err : undefined,
          });
        }
        break;
    }
  }
  const CREATED = 201;
  const FAILURE = 500;
  const newOrder = async (req, res) => {
    try {
        let TokenBody = {
            requestType: "Fashion Payment",
            mid: "PXizyI79545785270970", // process.env.MID_DEV
            websiteName: "Veztyle Fashion",
            orderId: req.body.orderIdFromApp,
            callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${req.body.orderIdFromApp}`,
            txnAmount: {
              value: req.body.totalPrice.toString(),
              currency: "INR",
            },
            userInfo: {
              custId: req.body.user.toString(),
            },
            // "enablePaymentMode": [
            //     { "mode": "UPI", channel: ["UPI, UPIPUSH"] },
            //     { "mode": "DEBIT_CARD", channel: ["RUPAY"] }
            // ]
          };
          getPaytmToken(TokenBody, (resp) => {
            return console.log("resp.body.txnToken", resp.body.txnToken) 
            // res
            //   .status(201)
            //   .send({
            //     success: true,
            //     message: "",
            //     data: output,
            //     token: resp.body.txnToken,
            //   });
          });

          return responseHandler(
            res,
            200,
            (data = false),
            (customResponse = false),
            `Request body `
          );

      let output = [];
      let orderItemList = [];
      let totalPrice = [];
      let totalWeight = [];
      if (Object.keys(req.body).length === 0) {
        return responseHandler(
          res,
          400,
          (data = false),
          (customResponse = false),
          `Request body is required in this method`
        );
      } else {
        await Promise.all(
          req.body.orderItems.map(async (item) => {
            const newOrderItem = new OrderItem({
              product: item.productId,
              quantity: item.quantity,
            });
            let result = await newOrderItem.save();
            const orderItemIdsResolved = await result._id;
            orderItemList.push(orderItemIdsResolved);
          })
        );
        await Promise.all(
          req.body.orderItems.map(async (item) => {
            const res = await Product.find({ _id: item.productId });
            const weight = res[0].weight * item.quantity;
            totalWeight.push(weight);
            const result = res[0].price * item.quantity;
            totalPrice.push(result);
          })
        );
  
        const sum = await totalPrice.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        const overallWeight = await totalWeight.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        let ordersCount = await Orders.find().count();
        const orderId = `ORDVZT${moment().format("DDMMYY")}${(
          "0000" + ordersCount
        ).slice(-4)}`;
        const newOrder = new Orders({
          orderItems: orderItemList,
          addressId: req.body.addressId,
          phone: req.body.phone,
          totalPrice: sum,
          deliveryPrice: req.body.deliveryPrice,
          subTotal: sum,
          amountPaid: req.body.amountPaid,
          amountDue: req.body.amountDue,
          user: req.body.user,
          orderId: orderId,
          orderIdFromApp: req.body.orderIdFromApp,
          productOwner: req.body.productOwner,
        });
        await newOrder
          .save()
          .then((response) => {
            // output.push(response);
            let TokenBody = {
              requestType: "Fashion Payment",
              mid: "PXizyI79545785270970", // process.env.MID_DEV
              websiteName: "Veztyle Fashion",
              orderId: req.body.orderIdFromApp,
              callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${req.body.orderIdFromApp}`,
              txnAmount: {
                value: req.body.totalPrice.toString(),
                currency: "INR",
              },
              userInfo: {
                custId: req.body.user.toString(),
              },
              // "enablePaymentMode": [
              //     { "mode": "UPI", channel: ["UPI, UPIPUSH"] },
              //     { "mode": "DEBIT_CARD", channel: ["RUPAY"] }
              // ]
            };
            getPaytmToken(TokenBody, (resp) => {
              return console.log("resp.body.txnToken", resp.body.txnToken) 
              // res
              //   .status(201)
              //   .send({
              //     success: true,
              //     message: "",
              //     data: output,
              //     token: resp.body.txnToken,
              //   });
            });
            return responseHandler(
              res,
              CREATED,
              (data = response),
              (customResponse = false),
              (message = false)
            );
          })
          .catch((err) => {
            // output.push(error);
            return responseHandler(
              res,
              FAILURE,
              (data = false),
              (customResponse = false),
              (message = false),
              (err = err)
            );
          });
        // return res.status(201).send({ success: true, message: "", data: output });
      }
    } catch (error) {
      return responseHandler(
        res,
        FAILURE,
        (data = false),
        (customResponse = false),
        (message = false),
        (err = error)
      );
    }
  };

module.exports = {
    getOrderList,
    newOrder,
    getOrderById,
    editOrderStatus,
    deleteOrder,
    getOrderSales,
    getOrderByUserId,
    orderPending,
    orderDelivered,
    getOrderListByDate,
    getOrderByOrderId
};