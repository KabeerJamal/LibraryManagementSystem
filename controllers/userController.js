const User = require('../models/User')


//this function is called when the user visits the home page(check router file)
exports.home = function(req, res) {
    if (req.session.user) {        
         res.render('userPortal.ejs', {user: req.session.user});
     } else {
        res.render('home.ejs');
     }
}

// This function renders the customer login page
exports.loginCustomerPage = function(req, res) {
    res.render('loginCustomer.ejs');
}


// This function handles customer login, validating user credentials
exports.loginCustomer = async function(req, res) {
    let user = new User(req.body, 'customer');
    try {
        await user.login();
        
        //create a session for the user and then redirect to exports.home
        req.session.user = {username: user.data.username, role: 'customer'};
        req.session.save(function() {
            res.redirect('/');
        });
    } catch (error) {
        console.log("hi");
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