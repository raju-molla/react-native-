const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrderByID } = require('../conrollers/order');
const auth = require('../middlware/auth');

router.post('/',createOrder);
router.get('/',auth,getOrder);
router.get('/:id',auth,getOrderByID);

module.exports = router