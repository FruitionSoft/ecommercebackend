const data = [
  {
    name: "New Order",
    value: 10,
  },
  {
    name: "New Users",
    value: 15,
  },
];
const dailyReport = () =>
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
  ${data.map((item) => {
    return `<tr><td>${item.name}</td><td>${item.value}</td></tr>`;
  })}
 
</table>
</body>
</html>`;

module.exports = dailyReport;
