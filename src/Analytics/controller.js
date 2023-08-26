const Category = require("../Category/model");
const Order = require("../Orders/model");
const Products = require("../Product/model");
const User = require("../Users/model");
const Fund = require("../Funds/model");
const Business = require("../BusinessData/model");
const mongoose = require("mongoose");
const moment = require("moment");
const { query } = require("express");

function getWeeksArrayForCurrentMonth() {
  const currentMonthStart = moment().startOf("month");
  const currentMonthEnd = moment().endOf("month");

  const weeksArray = [];

  let currentDate = currentMonthStart.clone();

  let weekCount = 1; // Initialize the week count

  while (currentDate.isSameOrBefore(currentMonthEnd)) {
    const weekStart = currentDate.clone().startOf("week");
    const weekEnd = currentDate.clone().endOf("week");

    weeksArray.push({
      start: weekStart,
      end: weekEnd,
      count: `week ${weekCount}`, // Add the week count
    });

    currentDate.add(1, "week");
    weekCount++; // Increment the week count
  }

  return weeksArray;
}

function getWeeksArrayForLastMonth(){
  const currentMonthStart = moment().subtract(1, 'month').startOf("month");
  const currentMonthEnd = moment().subtract(1, 'month').endOf("month");

  const weeksArray = [];

  let currentDate = currentMonthStart.clone();

  let weekCount = 1; // Initialize the week count

  while (currentDate.isSameOrBefore(currentMonthEnd)) {
    const weekStart = currentDate.clone().startOf("week");
    const weekEnd = currentDate.clone().endOf("week");

    weeksArray.push({
      start: weekStart,
      end: weekEnd,
      count: `week ${weekCount}`, // Add the week count
    });

    currentDate.add(1, "week");
    weekCount++; // Increment the week count
  }

  return weeksArray;

}

function getLastThreeMonths() {
  const today = moment();
  const lastMonthEnd = today.clone().subtract(1, 'month').endOf('month');
  const twoMonthsAgoEnd = today.clone().subtract(2, 'months').endOf('month');
  const threeMonthsAgoEnd = today.clone().subtract(3, 'months').endOf('month');

  const months = [
    {
      start: threeMonthsAgoEnd.clone().startOf('month'),
      end: threeMonthsAgoEnd,
      count: threeMonthsAgoEnd.format('MMMM'),
    },
    {
      start: twoMonthsAgoEnd.clone().startOf('month'),
      end: twoMonthsAgoEnd,
      count: twoMonthsAgoEnd.format('MMMM'),
    },
    {
      start: lastMonthEnd.clone().startOf('month'),
      end: lastMonthEnd,
      count: lastMonthEnd.format('MMMM'),
    },
  ];

  return months;
}

function getAllMonthsInYear() {
  const months = [];
  const currentDate = new Date(); // Get the current date
  const year = currentDate.getFullYear();
  console.log(year)

  for (let month = 0; month < 12; month++) {
    const monthStart = moment({ year, month, day: 1 });
    const monthEnd = monthStart.clone().endOf('month');
    const monthName = monthStart.format('MMMM');
    
    months.push({
      start: monthStart,
      end: monthEnd,
      count: monthName
    });
  }
  
  return months;
}



const adminAnalytics = async (req, res) => {
  try {
    //dateOrdered
    var list = new Object();
    let query;
    let orders;
    // GET CURRENT DATE
    const currentDate = new Date();

    // GET CURRENT MONTH DETAILS
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    // GET LAST MONTH DETAILS
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    // GET LAST THREEMONTH DATA
    const startOfLastThreeMonths = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      1
    );

    const endOfLastThreeMonths = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      30
    );

    // GET YEAR 
    const getYearFirstDay = new Date(
      currentDate.getFullYear(),
      0, 
      2   
    );

    const getYearLastDay = new Date(
      currentDate.getFullYear()+1,
      0, 
      1
    );

    // GET LAST WEEK DATA
    const startOfLastWeek = new Date(currentDate);
    startOfLastWeek.setDate(currentDate.getDate() - 7);

    //TODAY
    const startOfToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      23,
      59,
      59
    );

    //YESTERDAY

    const startOfYesterday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );
    const endOfYesterday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    if (req.body.type === "date") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: req.body.from, $lt: req.body.to },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "this_month") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfMonth, $lt: endOfMonth },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "today") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfToday, $lt: endOfToday },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "yesterday") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfYesterday, $lt: endOfYesterday },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "last_month") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "last_three_month") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfLastThreeMonths, $lt: endOfLastThreeMonths },
        // Replace the date range with your desired date range
      };
    }else if (req.body.type === "yearly") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: getYearFirstDay, $lt: getYearLastDay },
        // Replace the date range with your desired date range
      };
    } else if (req.body.type === "last_seven_days") {
      query = {
        productOwner: req.params.id, // Replace with the desired status value
        dateOrdered: { $gte: startOfLastWeek, $lt: endOfToday },
        // Replace the date range with your desired date range
      };
    }
    orders = await Order.find(query);



    let shipment = orders.filter((x) => x.status === "SHIPMENT");
    let pending = orders.filter((x) => x.status === "PENDING");
    let inprocess = orders.filter((x) => x.status === "PROCESSING");
    let completed = orders.filter((x) => x.status === "DELIVERED");
    let ordersComplete = completed.length;
    let ordersInprocess = inprocess.length;
    let totalOrdersSeller = orders.length;
    let shipmentCount = shipment.length;
    let totalProducts = await Products.find({
      productOwner: req.params.id,
    }).count();
    let totalShops = await Business.find({ userId: req.params.id }).count();
    // let totalSellers = await User.find({isAdmin: true}).count();
    // let totalUsers = await User.find({isAdmin: false}).count();
    // let totalOrders = await Order.find().count();
    let totalAnalytics = [
      {
        _id: 1,
        title: "Total Shops",
        count: totalShops,
        type: "Total",
        color: "#f3a683",
      },
      {
        _id: 2,
        title: "Total Products",
        count: totalProducts,
        type: "Total",
        color: "#55efc4",
      },
      {
        _id: 3,
        title: "Total Orders",
        count: totalOrdersSeller,
        type: "Total",
        color: "#778beb",
      },
      {
        _id: 4,
        title: "Orders Pending",
        count: pending.length,
        type: "Total",
        color: "#e77f67",
      },
      {
        _id: 5,
        title: "Orders Inprocess",
        count: ordersInprocess,
        type: "Total",
        color: "#b2bec3",
      },
      {
        _id: 6,
        title: "Orders Shipment",
        count: shipmentCount,
        type: "Total",
        color: "#b2bec3",
      },
      {
        _id: 7,
        title: "Orders Completed",
        count: ordersComplete,
        type: "Total",
        color: "#cd84f1",
      },
    ];
    //get income by month and year
    let incomeList = orders;
    // console.log(incomeList)
    list.incomeData = await getIncomeData(incomeList, req.body.type,req.params.id);
    list.analytics = totalAnalytics;
    return res
      .status(200)
      .send({ success: true, message: "", data: list, body: req.body });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ success: false, message: "Bad request" });
  }
};

function getIncomeData(orders, type,paramsId) {
  let id = paramsId;
  let list;
  if (type == "last_seven_days") {
    list = [
      moment().subtract(6, "days").format("DD-MM-YYYY"),
      moment().subtract(5, "days").format("DD-MM-YYYY"),
      moment().subtract(4, "days").format("DD-MM-YYYY"),
      moment().subtract(3, "days").format("DD-MM-YYYY"),
      moment().subtract(2, "days").format("DD-MM-YYYY"),
      moment().subtract(1, "days").format("DD-MM-YYYY"),
      moment().format("DD-MM-YYYY"),
    ];
  } else if (type == "today") {
    list = [moment().format("DD-MM-YYYY")];
  } else if (type == "yesterday") {
    list = [moment().subtract(1, "days").format("DD-MM-YYYY")];
  } else if (type == "this_month") {
    list = getWeeksArrayForCurrentMonth()
  }else if (type == "last_month") {
    list = getWeeksArrayForLastMonth()
  }else if (type == "last_three_month") {
    list = getLastThreeMonths()
  }else if (type == "yearly") {
    list = getAllMonthsInYear()
  } else {
    list = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
  }
  let incomeList = new Array();
  const totalOrderData = orders;

    list.map((item) => {
    if (totalOrderData) {
      let filteredData;
      if (type == "last_seven_days") {
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("DD-MM-YYYY") == item
        );
      } else if (type == "today") {
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("DD-MM-YYYY") == item
        );
      } else if (type == "yesterday") {
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("DD-MM-YYYY") == item
        );
      } else if (type == "this_month") {
        console.log(moment(item.start).format("DD-MM-YYYY"))
        console.log(moment(item.end).format("DD-MM-YYYY"))
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("DD-MM-YYYY") >= moment(item.start).format("DD-MM-YYYY") && moment(x.dateOrdered).format("DD-MM-YYYY") <=moment(item.end).format("DD-MM-YYYY")
        );
      }else if (type == "last_month") {
        
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("DD-MM-YYYY") >= moment(item.start).format("DD-MM-YYYY") && moment(x.dateOrdered).format("DD-MM-YYYY") <=moment(item.end).format("DD-MM-YYYY")
        );
      }else if (type == "last_three_month") {
        filteredData = totalOrderData.filter(
          x => moment(x.dateOrdered).isBetween(item.start, item.end, null, '[]')
        );
      }else if (type == "yearly") {
        filteredData = totalOrderData.filter(
          x => moment(x.dateOrdered).isBetween(item.start, item.end, null, '[]')
        );
      }else {
        filteredData = totalOrderData.filter(
          (x) => moment(x.dateOrdered).format("MM") == item
        );
      }
      if (filteredData?.length > 0) {
        if (filteredData.length > 1) {
          let sum = filteredData.reduce((a, b) => a + b["amountPaid"], 0);
          return incomeList.push({
            value: sum,
            label: type=="this_month" || type=="last_month" || type =="last_three_month" ||type =="yearly" ?item.count:item,
            frontColor: (sum <="10000" && "#d9534f") || (sum <="10000" &&sum <="50000" && "#177AD5") || (sum >="50000" && "#5cb85c")  ,
          });
        } else {
          return incomeList.push({
            value: filteredData[0].amountPaid,
            label: type=="this_month" || type=="last_month" || type =="last_three_month" ||type =="yearly" ?item.count:item,
            frontColor: (sum <="10000" && "#d9534f") || (sum <="10000" &&sum <="50000" && "#177AD5") || (sum >="50000" && "#5cb85c"),
          });
        }
      } else {
        return incomeList.push({
          value: 0,
          label: type=="this_month" || type=="last_month" || type =="last_three_month" ||type =="yearly" ?item.count:item,
          frontColor: (sum <="10000" && "#d9534f") || (sum <="10000" &&sum <="50000" && "#177AD5") || (sum >="50000" && "#5cb85c"),
        });
      }
    }
  });
  return incomeList;
}

const getSellerList = async (req, res) => {
  await User.find({ isAdmin: true, isSA: false })
    .select("-passwordHash -otp")
    .then((response) => {
      return res
        .status(200)
        .send({ success: true, message: "", data: response });
    })
    .catch((error) => {
      return res.status(500).send({ success: false, error: error.message });
    });
};

const getSellerEarningAnalytics = async (req, res) => {
  try {
    let FundList = await Fund.find({ user_id: req.params.id, status: "DONE" });
    await Order.find({ productOwner: req.params.id })
      .then((response) => {
        let result = {
          total_income: 0,
          amount_processing: 0,
          amount_claimed: 0,
          amount_pending: 0,
        };
        if (response.length > 0) {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const beforeSevenDays = new Date(
            new Date() - 7 * 24 * 60 * 60 * 1000
          );

          let total_income = response.reduce(
            (acc, amount) => acc + amount.amountPaid,
            0
          );
          result.total_income = total_income;

          let filteredAmount = response.filter(
            (x) => new Date(x.deliveryDate) > sevenDaysAgo
          );
          let amount_processing = filteredAmount.reduce(
            (acc, amount) => acc + amount.amountPaid,
            0
          );
          result.amount_processing = amount_processing;

          //calculating already claimed amount from fund
          let fund_raised = 0;
          if (FundList.length > 0) {
            fund_raised = FundList.reduce(
              (acc, amount) => acc + amount.amount,
              0
            );
          }

          let filteredAmountPending = response.filter(
            (x) => new Date(x.deliveryDate) < beforeSevenDays
          );
          let amount_pending = filteredAmountPending.reduce(
            (acc, amount) => acc + amount.amountPaid,
            0
          );
          result.amount_pending = Number(amount_pending) - Number(fund_raised);

          result.amount_claimed = fund_raised;
        }
        return res
          .status(200)
          .send({ success: true, message: "", data: result });
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ success: false, message: "", error: error.message });
      });
  } catch (error) {
    return res.status(400).send({ success: false, message: "Bad request" });
  }
};

module.exports = {
  adminAnalytics,
  getSellerList,
  getSellerEarningAnalytics,
};
