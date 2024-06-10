const Books = require('../models/Books');

exports.addBooks = async function(req, res) {
    res.render('addBooks.ejs');
}

exports.addBooksToDatabase = async function(req, res) {
    // Get the book information from the form
    const title = req.body.title;
    const author = req.body.author;
    const isbn = req.body.isbn;
    const publicationYear = req.body.publicationYear;

    // Create a new book object
    const book = new Books(title, author, isbn, publicationYear);

    await book.addBooksToDatabase();
}