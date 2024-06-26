const db = require('../db.js');


class Books {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    // Add methods and properties here
    
    async addBooksToDatabase() {
        return new Promise(async (resolve,reject) =>  {
            this.cleanUp();
            this.validate();
            if (this.errors.length == 0) {
                const uniqueBook = await this.isUnique();
                if (uniqueBook) {
                    try {
                        
                        // Insert book information into the database
                        const query = 'INSERT INTO books (title, author, total_copies, available_copies, publication_year) VALUES (?, ?, ?, ?, ?)';
                        const values = [this.data.title, this.data.author, this.data.copies , this.data.copies, this.data.year];
                        await db.query(query, values);
                        resolve("new book added to database");
                        }   catch (error) {
                            reject(error);
                        }
                } else {
                    resolve("book already exists in database, copy incremented by 1");
                }
            } else {
                //if there are errors
                reject(this.errors);
            }
            
        })
    }


    cleanUp() {
        if (typeof(this.data.title) != "string") {this.data.title = "";}
        if (typeof(this.data.author) != "string") {this.data.author = "";}
        if (typeof(this.data.year) != "string") {this.data.year = "";}

        //get rid of any bogus properties
        this.data = {
            title: this.data.title.trim().toLowerCase(),
            author: this.data.author.trim().toLowerCase(),
            year: this.data.year.trim().toLowerCase(),
            copies: parseInt(this.data.copies)
        }

    }

    validate() {
        if (this.data.title == "") {this.errors.push("You must provide a title");}
        if (this.data.author == "") {this.errors.push("You must provide an author");}
        if (this.data.year == "") {this.errors.push("You must provide a publication year");}
    }

    //to check if unique we need to check if book title, author and publication year are the same
    async isUnique() {
        const query = 'SELECT * FROM books WHERE title = ? AND author = ? AND publication_year = ?';
        const values = [this.data.title, this.data.author, this.data.year];
        const [rows] = await db.query(query, values);
        //console.log(rows);
        if (rows.length == 0) {

            return true;
        } else {
            // Book already exists, update its total and available copies
            const bookId = rows[0].book_id; // 'id' is the primary key of your 'books' table
        
            // update query to increase total and available copies by 1
            const updateQuery = 'UPDATE books SET total_copies = total_copies + ?, available_copies = available_copies + ? WHERE book_id = ?';
            const updateValues = [this.data.copies, this.data.copies, bookId];
        
            // Execute the update query
            await db.query(updateQuery, updateValues);
            return false;
        }
    }
    
}

module.exports = Books;