const db = require('../db.js');


class Books {
    constructor(title, author, isbn, publicationYear) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationYear = publicationYear;
    }

    // Add methods and properties here
    
    addBooksToDatabase() {
        return new Promise(async function(resolve,reject) {
            try {
            // Insert book information into the database
            const query = 'INSERT INTO books (title, author, isbn, publicationYear) VALUES (?, ?, ?, ?)';
            const values = [this.title, this.author, this.isbn, this.publicationYear];
            await db.query(query, values);
            console.log('Book information inserted successfully');
            }   catch (error) {
                console.error('Error inserting book information:', error);
            }
        })
    }

    
}