/**
 * Express router for handling different routes.
 * @module router
 */



const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const reservationController = require('./controllers/reservationController');

const multer = require('multer');
const path = require('path');


//Conigure storage for multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');  // Directory where the image will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);  // Generate unique file name
    }
});


const upload = multer({ storage: storage });

/**
 * Route for the home page.
 * @name GET /
 * @function
 */
router.get('/', userController.home);

/**
 * Route for the login customer page.
 * @name GET /loginCustomerPage
 * @function
 */
router.get('/loginCustomerPage', userController.loginCustomerPage);

/**
 * Route for the login admin page.
 * @name GET /loginAdminPage
 * @function
 */
router.get('/loginAdminPage', userController.loginAdminPage);

/**
 * Route for logging in an admin.
 * @name POST /loginAdmin
 * @function
 */
router.post('/loginAdmin', userController.loginAdmin);

/**
 * Route for logging in a customer.
 * @name POST /loginCustomer
 * @function
 */
router.post('/loginCustomer', userController.loginCustomer);

/**
 * Route for logging out a customer and admin.
 * @name GET /logout
 * @function
 */
router.get('/logout', userController.logout);

/**
 * Route for the register customer page.
 * @name GET /registerCustomerPage
 * @function
 */
router.get('/registerCustomerPage', userController.registerCustomerPage);

/**
 * Route for registering a customer.
 * @name POST /registerCustomer
 * @function
 */
router.post('/registerCustomer', userController.registerCustomer);

/**
 * Route for the admin portal.
 * @name GET /adminPortal
 * @function
 */
router.get('/adminPortal', userController.adminPortal);

/**
 * Route for adding books.
 * @name GET /addBooks
 * @function
 */
router.get('/addBooks', bookController.addBooks);

/**
 * Route for adding books to the database.
 * @name POST /addBooksToDatabase
 * @function
 */
router.post('/addBookToDatabase',upload.single('cover_image'), bookController.addBooksToDatabase);
router.post('/increaseCopies/:bookId', bookController.increaseCopies);
router.post('/decreaseCopies/:bookId', bookController.decreaseCopies);
router.get('/removeBook/:bookId', bookController.removeBook);

//receives a post search request with input field, which we then direct to bookController.searchBooks
router.post('/search', bookController.searchBooks);
router.post('/searchReservation', reservationController.searchReservations);


router.get('/book/:bookId', bookController.bookDetails);//this is to render bookDetails.ejs
router.post('/book/:bookId', bookController.bookDetails);//this is for the modal in search.js

//receives a post request with the bookId and copyId, which we then direct to reservationController.reserveBook
router.post('/reserve', reservationController.reserveBook);

router.get('/userReservationDetails', reservationController.userReservationDetails);

//Admin can collect and return books:
router.post('/collect/:reservation_id', reservationController.collectBook);
router.post('/return/:reservation_id', reservationController.returnBook);

//User can cancel a reservation:
router.post('/cancelReservation/:reservation_id', reservationController.cancelReservation);

router.get("/showReservations", reservationController.borrowerDetails);

module.exports = router;

