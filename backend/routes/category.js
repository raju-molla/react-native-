const express = require('express');
const router  = express.Router();
const api = process.env.API_URL

const { createCat, getCat, catDelete, getByIDCat, categoryUpdate, updateCategory } = require('../conrollers/category');
const auth = require('../middlware/auth');
const permission = require('../middlware/permission');

router.post('/',auth,permission([true]),createCat);
router.get('/',getCat);
router.delete('/:id',auth,permission([true]),catDelete);
router.get('/:id',getByIDCat);
router.put('/:id',auth,permission([true]),updateCategory);

module.exports = router