const APP_VERSION = "1.0.0";
const APP_DESC = "UI Implementation \nNotification \nCustomer Support";
const LINK = "http://www.google.com";
const ORDER_A_STATUS = true;

const mascelinous = async (req, res) => {
    try {
        var result = {
            APP_VERSION: APP_VERSION,
            APP_UP_DESC: APP_DESC,
            APP_LINK: LINK,
            APP_ACCEPT_ORDER: ORDER_A_STATUS
        }
        res.status(200).send({ success: true, data: result })
    } catch (error) {
        res.status(500).send({ success: false, message: "Bad request" })
    }
}

module.exports = {
    mascelinous
}