const User = require('../models/User')


//this function is called when the user visits the home page(check router file)
exports.home = function(req, res) {
    res.render('home.ejs');
}

// This function renders the customer login page
exports.loginCustomerPage = function(req, res) {
    res.render('loginCustomer.ejs');
}


// This function handles customer login, validating user credentials
exports.loginCustomer = async function(req, res) {
    let user = new User(req.body, 'customer');
    try {
        const loggedInUser = await user.login();
        res.send(loggedInUser);
    } catch (error) {
        res.send(error);
    }
}


// This function renders the customer registration page
exports.registerCustomerPage = function(req, res) {
    res.render('registerCustomer.ejs');
}

// This function handles customer registration, adding a new user to the database
exports.registerCustomer = async function(req,res) {
    let user = new User(req.body, 'customer');
    try {
        await user.register();
        res.send('User registered');
    } catch(error)  {
        res.send(error);
    }
    
}

// This function renders the admin portal page
exports.adminPortal = function(req, res) {
    res.render('adminPortal.ejs');
}