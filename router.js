//Over here we make all get and post requests
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.get('/', userController.home);


module.exports = router;