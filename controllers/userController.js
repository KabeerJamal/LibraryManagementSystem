const User = require('../models/User')
const Book = require("../models/Books");



/**
 * Renders the home page based on the user's role.
 * If the user is logged in as an admin, it renders the admin portal page.
 * If the user is logged in as a regular user, it renders the user portal page.
 * If the user is not logged in, it renders the home page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.home = async function(req, res) {
    if (req.session.user) {        
        if(req.session.user.role == 'admin') {
            res.render('adminPortal.ejs');
        } else {
            const books = await Book.getAllBooks();
            // res.render('userPortal.ejs',
            //      { user: req.session.user, books,
            //        AvailableCopiesText: true }
            //     );
            res.render('userPortal.ejs', { 
                user: { 
                    ...req.session.user, // Spread the existing user properties
                    books: books         // Add the books as a property of the user object
                },
                AvailableCopiesText: true 
            });
            
        }
    } else {
        try {
            // Make sure getAllBooks is asynchronous if necessary
            const books = await Book.getAllBooks(); // Assuming this returns a promise
            res.render('home', { books });
        } catch (error) {
            console.error("Error fetching books:", error);
            res.render('home', { books: [] }); // Render with an empty array in case of error
        }
    }
};


/**
 * Renders the customer login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.loginCustomerPage = function(req, res) {
    res.render('loginCustomer.ejs');
}

/**
 * Handles customer login, validating user credentials.
 * If the login is successful, it creates a session for the user and redirects to the home page.
 * If the login fails, it adds an error flash message and redirects to the customer login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.loginCustomer = async function(req, res) {
    let user = new User(req.body, 'customer');
    try {
        await user.loginCustomer();
        
        req.session.user = {username: user.data.username, role: 'customer'};
        req.session.save(function() {
            res.redirect('/');
        });
    } catch (error) {
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/loginCustomerPage');
        })
    }
}

/**
 * Renders the admin login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.loginAdminPage = function(req, res) {
    res.render('loginAdmin.ejs');
}

/**
 * Handles admin login, validating user credentials.
 * If the login is successful, it creates a session for the user and redirects to the home page.
 * If the login fails, it adds an error flash message and redirects to the admin login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.loginAdmin = async function(req, res) {
    let user = new User(req.body, 'admin');
    try {
        await user.loginAdmin();
        
        req.session.user = {username: user.data.username, role: 'admin'};
        req.session.save(function() {
            res.redirect('/');
        });
    } catch (error) {
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/loginAdminPage');
        })
    }
}

/**
 * Logs out the user by destroying the session and redirecting to the home page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
}

/**
 * Renders the customer registration page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.registerCustomerPage = function(req, res) {
    res.render('registerCustomer.ejs');
}

/**
 * Handles customer registration, adding a new user to the database.
 * If the registration is successful, it creates a session for the user and redirects to the home page.
 * If the registration fails, it adds an error flash message and redirects to the customer registration page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.registerCustomer = async function(req,res) {
    let user = new User(req.body, 'customer');
    try {
        await user.register();
        req.session.user = {username: user.data.username, role: 'customer'};
        req.session.save(function() {
            res.redirect('/');
        });
    } catch(error)  {
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/registerCustomerPage');
        })
    }
}

/**
 * Renders the admin portal page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.adminPortal = function(req, res) {
    res.render('adminPortal.ejs');
}

exports.userPortal = async function(req, res) {
    res.render('userPortal.ejs', {AvailableCopiesText: true});
}


exports.mustBeLoggedInAdmin = function(req, res, next) {
    if (req.session.user && req.session.user.role == 'admin') {
        next();
    } else {
        req.flash('errors', 'You must be logged in to perform that action');
        req.session.save(function() {
            res.redirect('/loginAdminPage');
        });
    }

}

exports.mustBeLoggedInUser = function(req, res, next) {
    if (req.session.user && req.session.user.role == 'customer') {
        next();
    } else {
        req.flash('errors', 'You must be logged in to perform that action');
        req.session.save(function() {
            res.redirect('/loginCustomerPage');
        });
    }

}
