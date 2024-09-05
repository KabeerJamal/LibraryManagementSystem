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

exports.increaseCopies = async function(req, res) {
    try {
        console.log(req.body);
        console.log(req.body.copiesToAdd);
        await Books.increaseCopies(req.params.bookId, req.body.copiesToAdd);
        req.flash('success', 'Book copies increased successfully');
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    } catch (error) {
        req.flash('errors', 'Book copies not increased, please try again.');
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    }
}


//create a searchBooks function
// this function will take the input inofmration and send this information to Books.searchBooks
//we will then get the information of the book and send it to the frontend as a response
exports.searchBooks = async function(req, res) {
    try {
        const bookInfos = await Books.searchBooks(req.body.searchTerm);
        if (bookInfos.length == 0) {
            res.json('');
            return;
        }
        res.json(bookInfos);

    } catch (error) {
        console.log(error);
    }
}

exports.bookDetails = async function(req, res) {
    //send information to Books.js
    try {
        const bookInfo = await Books.receiveBookDetails(req.params.bookId);
        //console.log(bookInfo);
        res.render('bookDetails.ejs', {bookInfo});
    } catch (error) {
        console.log(error);
    }
}
