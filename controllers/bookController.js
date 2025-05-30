const Books = require('../models/Books');

exports.addBooks = async function(req, res) {
    res.render('addBooks.ejs');
}

exports.addBooksToDatabase = async function(req, res) {
    // Create a new book object

    // Construct the cover image path
    const coverImagePath = `/uploads/${req.file.filename}`;

     // Add coverImagePath to req.body
    req.body.coverImagePath = coverImagePath;
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


exports.decreaseCopies = async function(req, res) {
    try {
        await Books.decreaseCopies(req.params.bookId, req.body.copiesToSubtract);
        req.flash('success', 'Book copies decreased successfully');
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    } catch (error) {
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    }
}

exports.removeBook = async function(req, res) {
    try {
        await Books.removeBook(req.params.bookId);
        req.flash('success', 'Book deleted successfully');
        req.session.save(function() {
            res.redirect('/adminPortal');
        })
    } catch (error) {   
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/book/' + req.params.bookId);
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
        res.json({books: bookInfos, role: req.session.user.role});

    } catch (error) {
        console.log(error);
    }
}

exports.bookDetails = async function(req, res) {
    //send information to Books.js
    try {
  
        const bookInfo = await Books.receiveBookDetails(req.params.bookId);
        bookInfo.role = req.session.user.role;
        //We have dontRender here, so in this case we just show the modal and not the detailed page
        if(req.body.dontRender == true) {
            res.json({bookInformation: bookInfo, customer: req.session.user.username});
        } else {
            res.render('bookDetails.ejs', {bookInfo});
        }
        
    } catch (error) {
        console.log(error);
    }
    
}

