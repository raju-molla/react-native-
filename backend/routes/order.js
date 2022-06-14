const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrderByID, orderUpdate, orderDelete, totalSales, orderCount, userOrder } = require('../conrollers/order');
const auth = require('../middlware/auth');
const permission = require('../middlware/permission');

router.post('/',createOrder);
router.get('/',auth,getOrder);
router.get('/:id',auth,getOrderByID);
router.put('/:id',auth,permission([true]),orderUpdate);
router.delete('/:id',auth,orderDelete);
router.get('/get/totalsales',totalSales);
router.get('/get/count',orderCount);
router.get('/get/userOrder/:id',userOrder);

module.exports = router