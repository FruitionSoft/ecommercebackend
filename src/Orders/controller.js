const Order = require('./model');
const OrderItem = require('../OrderItems/model');
const Product = require('../Product/model');
const mongoose = require('mongoose');
const moment = require("moment");
const { getPaytmToken } = require("../services/paytmToken");

const getOrderList = async (req, res) => {
    try {
        const controllerList = await Order.find()
            .populate({
                path: 'orderItems',
                populate: { path: 'product' }
            })
            .populate('user', 'name').sort({ 'dateOrdered': -1 });
            console.log('Initialize response: ', controllerList)
        if (!controllerList) {
            console.log(controllerList)
            return res.status(500).send({ success: false })
        } else {
            return res.status(200).send({ success: true, message: '', data: controllerList });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Bad request" })
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

const newOrder = async (req, res) => {
    try {
        let output = [];
        let orderItemList = [];
        let totalPrice= [];


        
        await Promise.all(req.body.orderItems.map(async item => {
            const newOrderItem = new OrderItem({
                product: item.productId,
                quantity: item.quantity
            });
            let result = await newOrderItem.save();
            const orderItemIdsResolved = await result._id;
            orderItemList.push(orderItemIdsResolved)
            
        }))
        await Promise.all(req.body.orderItems.map(async item => {
            const res =await Product.find({_id:item.productId})
            const result=res[0].price*item.quantity
            totalPrice.push(result)
            console.log(totalPrice);
           
            
        }))

        const sum =await totalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let ordersCount = await Order.find().count();
            const orderId = `#ORDHNDMDANDR${moment().format("DDMMYY")}${("000" + ordersCount).slice(-4)}`;
            console.log(orderItemList)
            const newOrder = new Order({
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
                productOwner:req.body.productOwner
            });
            console.log(newOrder)
            await newOrder.save().then(response => {
                output.push(response);
            }).catch(error => {
                console.log(error)
                output.push(error);
            })
        let TokenBody = {
            "requestType": "Payment",
            "mid": process.env.MID_DEV,
            "websiteName": "Handmade",
            "orderId": req.body.orderIdFromApp,
            "callbackUrl": `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${req.body.orderIdFromApp}`,
            "txnAmount": {
                "value": req.body.amountPaid.toString(),
                "currency": "INR",
            },
            "userInfo": {
                "custId": req.body.user.toString(),
            }
            // "enablePaymentMode": [
            //     { "mode": "UPI", channel: ["UPI, UPIPUSH"] },
            //     { "mode": "DEBIT_CARD", channel: ["RUPAY"] }
            // ]
        }
        console.log(TokenBody);
        return res.status(201).send({ success: true, message: '', data: output });
        // getPaytmToken(TokenBody, resp => {
        //     return res.status(201).send({ success: true, message: '', data: output, token: resp.body.txnToken });
        // })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Bad request", error: error.message })
    }
}

module.exports = {
    getOrderList,
    newOrder,
    getOrderById,
    editOrderStatus,
    deleteOrder,
    getOrderSales,
    getOrderByUserId,
    orderPending,
    orderDelivered

};