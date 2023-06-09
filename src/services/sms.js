const axios = require("axios");

const sendSMS = async (otp, number) => {
    console.log(number)
    const apiKey = process.env.TXTLCL
    const sender = "HNDMAD"
    const message = encodeURIComponent(`Dear customer, use this One Time Password ${otp} to complete signup in to your account.`);
    var url = "http://api.textlocal.in/send/?" + 'apiKey=' + apiKey + '&sender=' + sender + '&numbers=' + number + '&message=' + message;
    axios
        .post(url)
        .then(function (response) {
            console.log("response ", response.data);
        })
        .catch(function (error) {
            console.log("error ", error.message);
        });
}

module.exports = {
    sendSMS
}