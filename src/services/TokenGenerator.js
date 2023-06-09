/* More Details: https://developer.paytm.com/docs/checksum/#node */

var PaytmChecksum = require("./paytmCheckSum");

const MID = "PXizyI79545785270970"
const MKEY = "D7x3B%sLdZGnVXXI"

function PaytmCheckSumFunction() {
    var paytmParams = {};

    /* Generate Checksum via Array */

    /* initialize an array */
    paytmParams["MID"] = MID;
    paytmParams["ORDERID"] = "YOUR_ORDER_ID_HERE";

    /**
    * Generate checksum by parameters we have
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, MKEY);
    paytmChecksum.then(function (result) {
        console.log("generateSignature Returns: " + result);
        var verifyChecksum = PaytmChecksum.verifySignature(paytmParams, MKEY, result);
        console.log("verifySignature Returns: " + verifyChecksum);
    }).catch(function (error) {
        console.log(error);
    });

    /* Generate Checksum via String */

    /* initialize JSON String */
    body = `{\"mid\":\`${MID}\`,\"orderId\":\"#ORD_EASHA_01\"}`

    /**
    * Generate checksum by parameters we have
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    var paytmChecksum = PaytmChecksum.generateSignature(body, MKEY);
    paytmChecksum.then(function (result) {
        console.log("generateSignature Returns: " + result);
        var verifyChecksum = PaytmChecksum.verifySignature(body, MKEY, result);
        console.log("verifySignature Returns: " + verifyChecksum);
    }).catch(function (error) {
        console.log(error);
    });
}

module.exports = {PaytmCheckSumFunction}