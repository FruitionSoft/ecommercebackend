const i = require("../../src/Analytics/controller");

let orderCount;
let userCount = 12;
let data;
const main = async () => {
  orderCount = await i.getTodayNewOrders();
  // data = [
  //   {
  //     name: "New Order",
  //     value: orderCount,
  //   },
  //   {
  //     name: "New Users",
  //     value: "15",
  //   },
  //   {
  //     name: "New Users",
  //     value: "15",
  //   },
  // ];
};
main();

const dailyReport = async () =>
  `<html>
<head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>
<h2>Daily Report</h2>
<table>
  <tr>
    <th>Name</th>
    <th>Total</th>
  </tr>
  <tr><td>New Orders</td><td>${orderCount}</td></tr>
  <tr><td>New Users</td><td>${userCount}</td></tr>
</table>
</body>
</html>`;

module.exports = dailyReport;
