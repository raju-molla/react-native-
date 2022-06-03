const express = require('express');
const router  = express.Router();
const api = process.env.API_URL

const { createCat, getCat, catDelete, getByIDCat, categoryUpdate, updateCategory } = require('../conrollers/category');

router.post('/',createCat);
router.get('/',getCat);
router.delete('/:id',catDelete);
router.get('/:id',getByIDCat);
router.put('/:id',updateCategory);

module.exports = router