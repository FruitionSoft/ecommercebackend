const nodemailer = require("nodemailer");
const dailyReport = require("./mailTemplates/dailyReport.js");
const i = require("../src/Analytics/controller.js");
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
const sendMail = async (req, res) => {
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Veztyle" muthukumar@fruitionsoft.in', // sender address
      to: "sathickbatcha71@gmail.com 19smkumar97@gmail.com", // list of receivers 19smkumar97@gmail.com
      subject: "Today's Report", // Subject line
      text: "", // plain text body
      html: await dailyReport(), // html body
    });

    return res.status(200).send({ status: true, messageCode: info.messageId });
  }

  main().catch = () => {
    return res.status(500).send({ status: true, messageCode: info.messageId });
  };
};

const discountDeletedMsg = async (name) => {
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Veztyle" muthukumar@fruitionsoft.in', // sender address
      to: "sathickbatcha71@gmail.com,19smkumar97@gmail.com", // list of receivers
      subject: "Discount expiry details", // Subject line
      text: "", // plain text body
      html: name, // html body
    });

    return console.log("done");
  }

  main().catch = () => {
    return console.log("error");
  };
};

module.exports = { sendMail, discountDeletedMsg };
