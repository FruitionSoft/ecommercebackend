const OrderItem = require('./model');

const getOrderItemList = async(req, res) => {
    const OrderItemList = await OrderItem.find();
    if(!OrderItemList) {
        res.status(500).send({success: false})
    }else {
        res.status(201).send({success: true, message: '', data: OrderItemList});
    }
}

const deleteOrderItems = async (req, res) => {
    try {
            await OrderItem.deleteMany({});
            return res.status(201).send({ success: true, message: 'Data deleted.' });
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

module.exports = {
    getOrderItemList,
    deleteOrderItems
};