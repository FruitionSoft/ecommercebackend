const {newProduct} = require('./controller');
const {Router} = require('express');
const router = new Router();

router.post('/newproduct', newProduct);

export default router();