const Books = require('../models/Books');

exports.addBooks = async function(req, res) {
    res.render('addBooks.ejs');
}

exports.addBooksToDatabase = async function(req, res) {
    // Create a new book object
    //console.log(req.body);
    const book = new Books(req.body);

    try {
        await book.addBooksToDatabase();
        req.flash('success', 'Book added successfully');
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    } catch (error) {
        req.flash('errors', 'Book not added, please try again.');
        req.session.save(function() {
            res.redirect('/addBooks');
        })
    }
    
}