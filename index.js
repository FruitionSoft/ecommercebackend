const express = require("express");
const moment = require("moment");
const app = express();
const { Router } = require("express");
const route = new Router();
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
//Modules import
const { authJwt } = require("./helpers/jwt");
const { errorHandler } = require("./helpers/errorHandler");
const {
  newProduct,
  getProductList,
  getProductListByCat,
  editProduct,
  deleteProduct,
  getProductById,
  getTodaysList,
  getProductAnalytics,
  filterByCategories,
  getTopPicksData,
  searchProduct,
  deleteAllProduct,
  getProductListBySeller,
  getPendingStatusProductList,
  getRejectedStatusProductList,
} = require("./src/Product/controller");
const {
  getCategoryList,
  addNewCategory,
  deleteCategory,
  editCategory,
  getCategoryNameList,
  getDashboarCategory,
  deleteImageFromAWS,
  getCategoryListByPID,
} = require("./src/Category/controller");
const {
  getOrderItemList,
  deleteOrderItems,
} = require("./src/OrderItems/controller");
const {
  getOrderList,
  newOrder,
  getOrderById,
  getOrderByUserId,
  editOrderStatus,
  deleteOrder,
  getOrderSales,
  orderPending,
  orderDelivered,
  getOrderListByDate,
  getOrderByOrderId,
} = require("./src/Orders/controller");
const {
  getUserList,
  newUser,
  getUserById,
  login,
  editUser,
  getUserAnalytics,
  deleteUser,
  otpValidator,
  forgotPassword,
  generateOTP,
  loginAdmin,
  getAdminTokens,
  getSellerToken,
  refreshToken,
} = require("./src/Users/controller");
const {
  addCart,
  editCart,
  CartList,
  deleteCartProduct,
  CartProductList,
  deleteCartByUser,
  increaseCartItem,
  decreaseCartItem,
} = require("./src/Cart/controller");
const {
  getReviewByProductId,
  addNewReview,
} = require("./src/Review/controller");
const {
  addFav,
  FavList,
  deleteFavProduct,
  FavDetailedList,
} = require("./src/Favoruit/controller");
const {
  addaddr,
  addrList,
  deleteaddr,
  editAddress,
  addrById,
  getCityState,
} = require("./src/Address/controller");
const {
  addDelv,
  DelvList,
  editDelv,
  DelvListAll,
  deleteAllList,
  getCityByState,
} = require("./src/DeliveryFee/controller");
const {
  adminAnalytics,
  getSellerList,
  getSellerEarningAnalytics,
} = require("./src/Analytics/controller");
const { mascelinous } = require("./src/Constants/mascelinous");
const {
  newSize,
  getSizeList,
  getSizeById,
  editSize,
  deleteSize,
  getSizeByCategoryID,
} = require("./src/Size/controller");
const {
  newBusinessData,
  getShopList,
  deleteShop,
  getShopById,
  updateShop,
} = require("./src/BusinessData/controller");
const { addNewChat, ChatList, updateChat } = require("./src/chat/controller");
const {
  addNewMainCategory,
  getMainCategoryList,
  editMainCategory,
  deleteMainCategory,
} = require("./src/MainCategory/controller");
const {
  getDimensions,
  NewDimensions,
  getDimensionsById,
  EditDimensions,
  deleteDimensions,
} = require("./src/Dimensions/Controller");
const {
  getDiscount,
  NewDiscount,
  getDiscountByID,
  editDiscount,
  deleteDiscount,
} = require("./src/discount/controller");
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
const { uploadProduct } = require("./services/multer");
//Bank API
const {
  getBankDataById,
  addNewBankDetail,
  updateBankDetail,
  getPendingBankData,
} = require("./src/BankDetails/controller");
//Fund API
const {
  getFundData,
  addNewFundDetail,
  updateFundDetail,
  getPendingFundData,
} = require("./src/Funds/controller");
const schedule = require("node-schedule");
const currentDate = moment();
//CRON JOB for daily report
// const job = schedule.scheduleJob("*/30 * * * * *", () => {
//   console.log("Running the daily report task...", new Date());
// });
const formattedDate = currentDate.format("2023-09-28T01:08:00");
console.log(formattedDate);

// Chat Process
const io = require("socket.io")();
const { v4: uuidv4 } = require("uuid");
const messageHandler = require("./handlers/message.handler");
const users = {};
function createUsersOnline() {
  const values = Object.values(users);
  const onlyWithUsernames = values.filter((u) => u.username !== undefined);
  return onlyWithUsernames;
}

io.on("connection", (socket) => {
  console.log("a user connected!");
  console.log(socket.id);
  users[socket.id] = { userId: uuidv4() };
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("action", { type: "users_online", data: createUsersOnline() });
  });
  socket.on("action", (action) => {
    switch (action.type) {
      case "server/join":
        console.log("Got join event", action.data);
        users[socket.id].username = action.data.name;
        users[socket.id].userId = action.data._id;
        io.emit("action", {
          type: "users_online",
          data: createUsersOnline(),
        });
        socket.emit("action", { type: "self_user", data: users[socket.id] });
        break;
      case "server/private_message":
        const conversationId = action.data.conversationId;
        const from = users[socket.id].userId;
        const userValues = Object.values(users);
        const socketIds = Object.keys(users);
        console.log(from);
        console.log(action.data.conversationId);
        updateChat(action.data.chatId, action.data.message);
        for (let i = 0; i < userValues.length; i++) {
          if (userValues[i].userId === conversationId) {
            const socketId = socketIds[i];
            io.to(socketId).emit("action", {
              type: "private_message",
              data: {
                ...action.data,
                conversationId: from,
              },
            });
            console.log("Working: ", {
              ...action.data,
              conversationId: from,
            });
            break;
          }
        }
        break;
    }
  });
});
io.listen(3001);

const fs = require("fs");
const { sendMail } = require("./services/mail");

//API Version
const API = process.env.API_URL;
//Authenticating the API
app.use(authJwt());
//Middleware to get json data
app.use(express.json());
//This will give logs of every request
app.use(morgan("tiny"));
app.use(express.static("assets/products"));
//Error handling
app.use(errorHandler);
app.use(cors());
app.options("*", cors());
//API connections

//Login
app.get(`${API}/sendmail`, sendMail);
//Analytics
app.get(`${API}/product/analytics`, getProductAnalytics);

//Dimensions
app.get(`${API}/dimensions/list`, getDimensions);
app.post(`${API}/dimensions/new`, NewDimensions);
app.get(`${API}/dimensions/list/:id`, getDimensionsById);
app.put(`${API}/dimensions/update/:id`, EditDimensions);
app.delete(`${API}/dimensions/delete/:id`, deleteDimensions);

//Product
app.post(`${API}/product/newproduct`, newProduct);
app.get(`${API}/product/list`, getProductList);
app.get(`${API}/product/listbycatid/:id`, getProductListByCat);
app.delete(`${API}/product/:id`, deleteProduct);
app.get(`${API}/productid/:id`, getProductById);
app.get(`${API}/product/todaysmenu/:id`, getTodaysList);
app.get(`${API}/product`, filterByCategories);
app.get(`${API}/product/search/:id`, searchProduct);
app.get(`${API}/products/gettoppick/:id`, getTopPicksData);
app.put(`${API}/product/:id`, editProduct);
app.get(`${API}/product/listbysellerid/:id`, getProductListBySeller);
app.get(`${API}/product/pending`, getPendingStatusProductList);
app.get(`${API}/product/rejected`, getRejectedStatusProductList);

// Main Category
app.post(`${API}/maincategory/new`, addNewMainCategory);
app.get(`${API}/maincategory/list`, getMainCategoryList);
app.put(`${API}/maincategory/:id`, editMainCategory);
app.delete(`${API}/maincategory/:id`, deleteMainCategory);

// Category
app.get(`${API}/category/list`, getCategoryList);
app.get(`${API}/categoryname/list`, getCategoryNameList);
app.get(`${API}/categoryname/dashlist`, getDashboarCategory);
app.post(`${API}/category/newcategory`, addNewCategory);
app.delete(`${API}/category/:id`, deleteCategory);
app.put(`${API}/category/:id`, editCategory);
app.get(`${API}/category/listbypid/:id`, getCategoryListByPID);

app.put(`${API}/images/aws/delete`, deleteImageFromAWS);

//Discount
app.post(`${API}/discount/new`, NewDiscount);
app.get(`${API}/discount/list`, getDiscount);
app.get(`${API}/discount/id/:id`, getDiscountByID);
app.put(`${API}/discount/id/:id`, editDiscount);
app.delete(`${API}/discount/id/:id`, deleteDiscount);

//Order
app.post(`${API}/order/new`, newOrder);
app.get(`${API}/order/:id`, getOrderById);
app.get(`${API}/orderbyorderid/:id`, getOrderByOrderId);
app.get(`${API}/order/list/all`, getOrderList);
app.delete(`${API}/order/:id`, deleteOrder);
app.get(`${API}/order/new/analytics`, getOrderSales);
app.delete(`${API}/orderitem/deleteall`, deleteOrderItems);
app.get(`${API}/orderitem/list`, getOrderItemList);
app.put(`${API}/order/edit/:id`, editOrderStatus);
app.get(`${API}/order/admin/pending/:id`, orderPending);
app.get(`${API}/order/admin/delivered/:id`, orderDelivered);
app.get(`${API}/order/user/:id`, getOrderByUserId);
app.post(`${API}/order/list/filter`, getOrderListByDate);

app.get(`${API}/user/list`, getUserList);
app.get(`${API}/user/:id`, getUserById);
app.post(`${API}/user/add`, newUser);
app.post(`${API}/user/login`, login);
app.post(`${API}/user/loginadmin`, loginAdmin);
app.put(`${API}/user/update/:id`, editUser);

//cart
app.post(`${API}/cart/new`, addCart);
app.put(`${API}/cart/update/:id`, editCart);
app.delete(`${API}/cart/:id`, deleteCartProduct);
app.get(`${API}/cartproduct/:id`, CartProductList);
app.get(`${API}/cart/:id`, CartList);
app.delete(`${API}/cart/user/:id`, deleteCartByUser);
app.get(`${API}/cart/increase/:id`, increaseCartItem);
app.get(`${API}/cart/decrease/:id`, decreaseCartItem);

//fav
app.post(`${API}/fav/new`, addFav);
app.delete(`${API}/fav/:id`, deleteFavProduct);
app.get(`${API}/fav/productlist/:id`, FavDetailedList);
app.get(`${API}/fav/:id`, FavList);

//Address
app.post(`${API}/address/new`, addaddr);
app.delete(`${API}/address/:id`, deleteaddr);
app.get(`${API}/getcitystate/:id`, getCityState);
app.get(`${API}/address/:id`, addrList);
app.get(`${API}/addressbyid/:id`, addrById);
app.put(`${API}/address/:id`, editAddress);

//Delivery
app.post(`${API}/delivery/new`, addDelv);
app.put(`${API}/delivery/:id`, editDelv);
app.get(`${API}/delivery/:id`, DelvList);
app.get(`${API}/delivery/list/all`, DelvListAll);
app.delete(`${API}/delivery/list/delete`, deleteAllList);
app.get(`${API}/delivery/city/list`, getCityByState);

//user
app.get(`${API}/refershToken/:id`, refreshToken);
app.get(`${API}/user/count`, getUserAnalytics);
app.get(`${API}/user/generateotp/:id`, generateOTP);
app.delete(`${API}/user/:id`, deleteUser);
app.put(`${API}/user/otp/:id`, otpValidator);
app.get(`${API}/user/admin/token`, getAdminTokens);
app.put(`${API}/user/password/:id`, forgotPassword);
app.get(`${API}/user/seller/token/:id`, getSellerToken);
app.get(`${API}/user/mascelinous`, mascelinous);

//review
app.get(`${API}/review/:id`, getReviewByProductId);
app.post(`${API}/review/new`, addNewReview);

//admin
app.post(`${API}/admin/analytics/:id`, adminAnalytics);
app.get(`${API}/admin/seller/list`, getSellerList);
app.get(`${API}/deleteAllProduct`, deleteAllProduct);
app.get(`${API}/seller/earnings/:id`, getSellerEarningAnalytics);

app.get(`${API}/image/:name`, (req, res) => {
  fs.writeFileSync(
    __dirname + "./assets/products/1662310783847_1631095891215.jpeg"
  );
});

//Size
app.post(`${API}/size/add`, newSize);
app.get(`${API}/size/list`, getSizeList);
app.get(`${API}/size/:id`, getSizeById);
app.get(`${API}/size/category/:id`, getSizeByCategoryID);
app.put(`${API}/size/:id`, editSize);
app.delete(`${API}/size/:id`, deleteSize);

//Shop
app.post(`${API}/shop/add`, newBusinessData);
app.get(`${API}/shop/list/:id`, getShopList);
app.delete(`${API}/shop/:id`, deleteShop);
app.get(`${API}/shop/:id`, getShopById);
app.put(`${API}/shop/:id`, updateShop);

//Chat
app.get(`${API}/chatlist/:fid/:tid`, ChatList);
app.post(`${API}/chatlist/new`, addNewChat);

//Bank API Calls ,
app.get(`${API}/seller/baccount/:id`, getBankDataById);
app.post(`${API}/seller/baccount`, addNewBankDetail);
app.put(`${API}/seller/baccount/:id`, updateBankDetail);
app.get(`${API}/seller/baccountpending`, getPendingBankData);

// Fund API
app.get(`${API}/seller/fund/:id`, getFundData);
app.post(`${API}/seller/fund`, addNewFundDetail);
app.put(`${API}/seller/fund/:id`, updateFundDetail);
app.get(`${API}/seller/fundpending`, getPendingFundData);

// Customer API's
mongoose
  .connect(process.env.CONNECTION, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(process.env.PORT || 3000, () => {
  console.log("Port is listening" + process.env.PORT);
});
