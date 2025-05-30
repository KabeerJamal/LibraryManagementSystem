const db = require('../db.js');


class Books {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  // Add methods and properties here

  async addBooksToDatabase() {
    return new Promise(async (resolve, reject) => {
      this.cleanUp();
      this.validate();
      if (this.errors.length == 0) {
        const uniqueBook = await this.isUnique();
        if (uniqueBook) {
          try {
            // Insert book information into the database
            const query =
              "INSERT INTO books (title, author, total_copies, available_copies, publication_year, cover_image) VALUES (?, ?, ?, ?, ?, ?)";
            const values = [
              this.data.title,
              this.data.author,
              this.data.copies,
              this.data.copies,
              this.data.year,
              this.data.coverImagePath,
            ];
            await db.query(query, values);
            resolve("new book added to database");
          } catch (error) {
            reject(error);
          }
        } else {
          resolve("book already exists in database, copy incremented by 1");
        }
      } else {
        //if there are errors
        reject(this.errors);
      }
    });
  }

  cleanUp() {
    if (typeof this.data.title != "string") {
      this.data.title = "";
    }
    if (typeof this.data.author != "string") {
      this.data.author = "";
    }
    if (typeof this.data.year != "string") {
      this.data.year = "";
    }

    //get rid of any bogus properties
    this.data = {
      title: this.data.title.trim(),
      author: this.data.author.trim(),
      year: this.data.year.trim(),
      copies: parseInt(this.data.copies),
      coverImagePath: this.data.coverImagePath,
    };
  }

  validate() {
    if (this.data.title == "") {
      this.errors.push("You must provide a title");
    }
    if (this.data.author == "") {
      this.errors.push("You must provide an author");
    }
    if (this.data.year == "") {
      this.errors.push("You must provide a publication year");
    }
  }

  //to check if unique we need to check if book title, author and publication year are the same
  async isUnique() {
    const query =
      "SELECT * FROM books WHERE title = ? AND author = ? AND publication_year = ?";
    const values = [this.data.title, this.data.author, this.data.year];
    const [rows] = await db.query(query, values);
    //console.log(rows);
    if (rows.length == 0) {
      return true;
    } else {
      // Book already exists, update its total and available copies
      const bookId = rows[0].book_id; // 'id' is the primary key of your 'books' table

      // update query to increase total and available copies of the book
      const updateQuery =
        "UPDATE books SET total_copies = total_copies + ?, available_copies = available_copies + ? WHERE book_id = ?";
      const updateValues = [this.data.copies, this.data.copies, bookId];

      // Execute the update query
      await db.query(updateQuery, updateValues);
      return false;
    }
  }

  //create a searchBooks function
  //this book will send the information it received and call a search query to search from the database the book and return the information of that book
  static searchBooks(searchTerm) {
    /*
        return new Promise(async (resolve, reject) => {
            console.log(searchTerm);
            const query = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
            const values = [`%${searchTerm}%`, `%${searchTerm}%`];
            const [rows] = await db.query(query, values);
            resolve(rows);


        })
        */

    return new Promise(async (resolve, reject) => {
      let query;
      let values;

      if (!searchTerm) {
        // If search term is empty, return no results
        query = "SELECT * FROM books WHERE 1 = 0";
        values = [];
      } else {
        // If search term is not empty, proceed with the original query
        query = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?";
        values = [`%${searchTerm}%`, `%${searchTerm}%`];
      }

      try {
        const [rows] = await db.query(query, values);
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    });
  }

  //create a bookDetails function, which returns information of the book with associated bookId
  static receiveBookDetails(bookId) {
    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM books WHERE book_id = ?";
      const values = [bookId];
      const [rows] = await db.query(query, values);
      resolve(rows[0]);
    });
  }

  static increaseCopies(bookId, copiesToAdd) {
    return new Promise(async (resolve, reject) => {
      //We are doing the same thing as we did in line 75, so we need to make it more clean in the future
      const updateQuery =
        "UPDATE books SET total_copies = total_copies + ?, available_copies = available_copies + ? WHERE book_id = ?";
      const updateValues = [copiesToAdd, copiesToAdd, bookId];
      await db.query(updateQuery, updateValues);
      resolve();
    });
  }

  static decreaseCopies(bookId, copiesToSubtract) {
    return new Promise(async (resolve, reject) => {
      //We are doing the same thing as we did in line 75, so we need to make it more clean in the future

      const book = await Books.receiveBookDetails(bookId);
      const availableCopies = book.available_copies;
      const totalCopies = book.total_copies;
      if (availableCopies < copiesToSubtract) {
        reject("These copies need to be available before they can be removed");
        return;
      }
      if (totalCopies < copiesToSubtract) {
        reject("You cannot remove more than the total copies");
        return;
      }

      const updateQuery =
        "UPDATE books SET total_copies = total_copies - ?, available_copies = available_copies - ? WHERE book_id = ?";
      const updateValues = [copiesToSubtract, copiesToSubtract, bookId];
      await db.query(updateQuery, updateValues);
      resolve();
    });
  }

  static removeBook(bookId) {
    return new Promise(async (resolve, reject) => {
      //if we want to remove a book, we need to check if it has any reservations of status reserved or collected, if it does, we cannot remove it
      // const checkQuery =
      //   "SELECT COUNT(*) AS count FROM reservation_items ri JOIN reservations r ON ri.reservation_id = r.reservation_id WHERE ri.book_id = ? AND r.status IN ('reserved', 'collected');";
      const checkQuery = "SELECT COUNT(*) AS count FROM reservation_items WHERE book_id = ?;"
      const [checkRows] = await db.query(checkQuery, [bookId]);
      console.log(checkRows[0].count);
      // if (checkRows[0].count > 0) {
      //   reject("Cannot remove book with active reservations");
      //   return;
      // }

      if (checkRows[0].count > 0) {
        reject("Cannot remove book with reservations involved");
        return;
      }

      const query = "DELETE FROM books WHERE book_id = ?";
      const values = [bookId];
      await db.query(query, values);
      resolve();
    });
  }
  // Method to get all books from the database
  static async getAllBooks() {
    const query = "SELECT * FROM books";
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = Books;