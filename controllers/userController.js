const User = require('../models/User')


//this function is called when the user visits the home page(check router file)
exports.home = function(req, res) {
    res.render('home.ejs');
}

exports.loginCustomerPage = function(req, res) {
    res.render('loginCustomer.ejs');
}

exports.registerCustomerPage = function(req, res) {
    res.render('registerCustomer.ejs');
}

exports.adminPortal = function(req, res) {
    res.render('adminPortal.ejs');
}