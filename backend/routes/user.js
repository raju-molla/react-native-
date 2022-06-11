const express = require('express');
const router = express.Router();

const { createAccount, allUser, singleUSer, login, countUser, userDelete, updateUser } = require('../conrollers/user');
const auth = require('../middlware/auth');

router.post('/register',createAccount);
router.get('/',auth,allUser);
router.get('/:id',auth,singleUSer);
router.post('/login',login);
router.get('/get/count',countUser);
router.delete('/delete/:id',userDelete);
router.put('/update/:id',auth,updateUser);

module.exports = router