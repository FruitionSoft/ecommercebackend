const https = require('https');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const PaytmChecksum = require('./paytmCheckSum');

const getPaytmToken = (body, callback) => {
    var paytmParams = {};

    const MID = process.env.MID_DEV
    const MKEY = process.env.MKEY

    paytmParams.body = body;

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    console.log('paytmParams.body: ',paytmParams.body)
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), MKEY).then(function (checksum) {
        console.log('checksum: ',checksum)
        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${body.orderId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                return callback(JSON.parse(response));
            });
        });

        post_req.write(post_data);
        post_req.end();
    });
}

module.exports = { getPaytmToken }