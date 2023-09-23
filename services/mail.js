const nodemailer = require("nodemailer");
const dailyReport = require("./dailyReport.js");
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "muthukumar@fruitionsoft.in",
    pass: "Muthu@Tech$4561",
  },
});
async function sendMail() {
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Veztyle" muthukumar@fruitionsoft.in', // sender address
      to: "sathickbatcha71@gmail.com,19smkumar97@gmail.com", // list of receivers
      subject: "Today's Report", // Subject line
      text: "", // plain text body
      html: dailyReport(), // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }

  main().catch(console.error);
}

module.exports = sendMail;
