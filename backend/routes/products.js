const express = require('express');
const router  = express.Router();
const api = process.env.API_URL

const { createProduct, getAllProduct, getById, productUpdate } = require('../conrollers/products');

router.post('/',createProduct);
router.get('/',getAllProduct);
router.get('/:id',getById);
router.put('/:id',productUpdate);

module.exports = router