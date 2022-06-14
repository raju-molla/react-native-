const express = require('express');
const router  = express.Router();
const api = process.env.API_URL
const mongoose = require('mongoose');
const multer = require('multer');

const { createProduct, getAllProduct, getById, productUpdate, productDelete, countProduct, isFeaturedProduct, GallaryImages } = require('../conrollers/products');
const auth = require('../middlware/auth');
const permission = require('../middlware/permission');




const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('invalid image type');

      if (isValid) {
          uploadError = null;
      }
      cb(uploadError, 'public/upload');
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage: storage });

router.post('/',uploadOptions.single('image',10),auth,permission([true]),createProduct);

router.put('/gallery/images/:id',uploadOptions.array('images'),GallaryImages);

router.get('/',getAllProduct);
router.get('/:id',getById);
router.put('/:id',uploadOptions.single('image'),auth,permission([true]),productUpdate);
router.delete('/:id',auth,permission([true]),productDelete);
router.get('/get/count',countProduct);
router.get('/get/featured/:count',isFeaturedProduct);

module.exports = router