//Over here we make all get and post requests
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');

// when user visits the home page, run the home function in userController file
router.get('/', userController.home);
router.get('/loginCustomerPage', userController.loginCustomerPage);
router.get('/registerCustomerPage', userController.registerCustomerPage);

router.get('/adminPortal' , userController.adminPortal);


router.get('/addBooks', bookController.addBooks);
router.post('/addBooksToDatabase', bookController.addBooksToDatabase);

module.exports = router;