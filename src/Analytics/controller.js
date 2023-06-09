const Category = require('../Category/model');
const Order = require('../Orders/model');
const Products = require('../Product/model');
const User = require('../Users/model');
const Fund = require("../Funds/model");
const Business = require('../BusinessData/model');
const mongoose = require('mongoose');
const moment = require("moment");

const adminAnalytics = async (req, res) => {
    try {
        var list = new Object();
        let orders = await Order.find({ productOwner: req.params.id });
        let inprocess = orders.filter(x => x.status !== "DELIVERED");
        let pending = orders.filter(x => x.status === "PROCESSING");
        let completed = orders.filter(x => x.status === "DELIVERED");
        let ordersComplete = completed.length;
        let ordersInprocess = inprocess.filter(x => x.status !== "PROCESSING").length;
        let totalOrdersSeller = orders.length;
        let totalProducts = await Products.find({ productOwner: req.params.id }).count();
        let totalShops = await Business.find({ userId: req.params.id }).count();
        // let totalSellers = await User.find({isAdmin: true}).count();
        // let totalUsers = await User.find({isAdmin: false}).count();
        // let totalOrders = await Order.find().count();
        const totalAnalytics = [
            {
                _id: 1,
                title: "Total Shops",
                count: totalShops,
                type: "Total",
                color: "#f3a683"
            },
            {
                _id: 2,
                title: "Total Products",
                count: totalProducts,
                type: "Total",
                color: "#55efc4"
            },
            {
                _id: 3,
                title: "Total Orders",
                count: totalOrdersSeller,
                type: "Total",
                color: "#778beb"
            },
            {
                _id: 4,
                title: "Orders Pending",
                count: pending.length,
                type: "Total",
                color: "#e77f67"
            },
            {
                _id: 5,
                title: "Orders Inprocess",
                count: ordersInprocess,
                type: "Total",
                color: "#b2bec3"
            },
            {
                _id: 6,
                title: "Orders Completed",
                count: ordersComplete,
                type: "Total",
                color: "#cd84f1"
            }
            // {
            //     _id: 7,
            //     title: "Total Sellers",
            //     count: totalSellers,
            //     type: "Total",
            //     color: "#f9ca24"
            // },
            // {
            //     _id: 8,
            //     title: "Total Users",
            //     count: totalUsers,
            //     type: "Total",
            //     color: "#badc58"
            // },
            // {
            //     _id: 9,
            //     title: "Total Orders",
            //     count: totalOrders,
            //     type: "Total",
            //     color: "#ff9f1a"
            // }
        ]
        //get income by month and year
        let incomeList = await Order.find({ productOwner: req.params.id });
        list.incomeData = await getIncomeData(incomeList);
        list.analytics = totalAnalytics
        console.log(list.incomeData)
        return res.status(201).send({ success: true, message: '', data: list });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ success: false, message: "Bad request" })
    }
}

function getIncomeData(orders) {
    let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
    let incomeList = new Array();
    const totalOrderData = orders;
    months.map(item => {
        if (totalOrderData) {
            let filteredData = totalOrderData.filter(x => moment(x.dateOrdered).format("MM") == item);
            if (filteredData?.length > 0) {
                if (filteredData.length > 1) {
                    let sum = filteredData.reduce((a, b) => a + b["amountPaid"], 0)
                    return incomeList.push(sum)
                } else {
                    return incomeList.push(filteredData[0].amountPaid)
                }
            } else {
                return incomeList.push(0)
            }
        }
    })
    return incomeList;
}

const getSellerList = async (req, res) => {
    await User.find({ isAdmin: true, isSA: false }).select('-passwordHash -otp')
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response });
        }).catch(error => {
            return res.status(500).send({ success: false, error: error.message });
        })
}


const getSellerEarningAnalytics = async (req, res) => {
    try {
        let FundList = await Fund.find({user_id: req.params.id, status: "DONE"});
        await Order.find({ productOwner: req.params.id })
            .then(response => {
                let result = {
                    total_income: 0,
                    amount_processing: 0,
                    amount_claimed: 0,
                    amount_pending: 0
                }
                if (response.length > 0) {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                    const beforeSevenDays = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

                    let total_income = response.reduce((acc, amount) => acc + amount.amountPaid, 0);
                    result.total_income = total_income;

                    let filteredAmount = response.filter(x => new Date(x.deliveryDate) > sevenDaysAgo);
                    let amount_processing = filteredAmount.reduce((acc, amount) => acc + amount.amountPaid, 0);
                    result.amount_processing = amount_processing;

                    //calculating already claimed amount from fund
                    let fund_raised = 0;
                    if(FundList.length > 0) {
                        fund_raised = FundList.reduce((acc, amount) => acc + amount.amount, 0);
                    }

                    let filteredAmountPending = response.filter(x => new Date(x.deliveryDate) < beforeSevenDays);
                    let amount_pending = filteredAmountPending.reduce((acc, amount) => acc + amount.amountPaid, 0);
                    result.amount_pending = Number(amount_pending) - Number(fund_raised);

                    result.amount_claimed = fund_raised;
                }
                return res.status(201).send({ success: true, message: '', data: result })
            }).catch(error => {
                return res.status(500).send({ success: false, message: '', error: error.message })
            })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Bad request' })
    }
}

module.exports = {
    adminAnalytics,
    getSellerList,
    getSellerEarningAnalytics
}