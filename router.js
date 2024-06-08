//Over here we make all get and post requests
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

// when user visits the home page, run the home function in userController file
router.get('/', userController.home);


module.exports = router;