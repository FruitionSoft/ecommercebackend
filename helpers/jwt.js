const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            '/v1/user/login',
            '/v1/user/loginadmin',
            '/v1/categoryname/dashlist',
            '/v1/user/mascelinous',
            '/v1/category/list',
            '/v1/user/add',
            '/v1/size/list',
            '/v1/maincategory/list',
            {url: /\/v1\/products\/gettoppick(.*)/, methods: ['GET', 'PUT', 'OPTIONS']},
            {url: /\/v1\/product\/search(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/service\/sms/, methods: ['PUT', 'OPTIONS']},
            {url: /\/v1\/user\/otp(.*)/, methods: ['GET','PUT', 'OPTIONS']},
            {url: /\/v1\/product\/listbycatid(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/getcitystate(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/productid(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/review(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/user\/generateotp(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/v1\/user\/password(.*)/, methods: ['PUT', 'OPTIONS']},
            {url: /\/v1\/category\/listbypid(.*)/, methods: ['GET', 'OPTIONS']},
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true);
    }
    done()
}

module.exports = {
    authJwt
}

// path: [
//     {url: /\/api\/v1\/cart(.*)/, methods: ['GET', 'OPTIONS']},
//     {url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
//     {url: /\/api\/v1\/order(.*)/, methods: ['GET', 'POST', 'OPTIONS']},
//     {url: /\/api\/v1\/user\/login/, methods: ['GET', 'POST', 'OPTIONS']},
//     '/v1/user/login',
//     '/v1/user/loginadmin'
// ]