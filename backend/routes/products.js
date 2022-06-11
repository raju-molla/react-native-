const express = require('express');
const router  = express.Router();
const api = process.env.API_URL
const mongoose = require('mongoose')

const { createProduct, getAllProduct, getById, productUpdate, productDelete, countProduct, isFeaturedProduct } = require('../conrollers/products');
const auth = require('../middlware/auth');
const permission = require('../middlware/permission');

router.post('/',auth,permission([true]),createProduct);
router.get('/',getAllProduct);
router.get('/:id',getById);
router.put('/:id',auth,permission([true]),productUpdate);
router.delete('/:id',auth,permission([true]),productDelete);
router.get('/get/count',countProduct);
router.get('/get/featured/:count',isFeaturedProduct);

module.exports = router