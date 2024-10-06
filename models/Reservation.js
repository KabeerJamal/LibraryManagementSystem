const db = require('../db.js');

class Reservation{
    constructor(data) {
        this.data = data;
    }

    //UMER INSTRUCTIONS
    static async borrowerDetails() {
    try {
      const query = `
        SELECT 
          users.username AS borrower_name, 
          books.title AS book_title, 
          reservations.status, 
          reservations.reserve_date, 
          reservations.collect_date, 
          reservations.collect_date_deadline,
          reservations.return_date,
          reservations.returned_at,
          reservations.reservation_id
        FROM 
          reservations
        JOIN 
          users ON reservations.user_id = users.id
        JOIN 
          books ON reservations.book_id = books.book_id
      `;

      // Use async/await with mysql2/promise
      const [results] = await db.query(query);
      return results;
    } catch (err) {
      throw new Error("Error retrieving reservation details: " + err);
    }
  }


    //You can make the function static, that way you can call the function without creating an object of the class
    //Over here you create a function borrower details which you already called  in the controller
    //Make sure you are returning a promise from the function, look other functions in the model for reference
    //in the function you get all data of reservation from the database via sql query and then you resolve the promise

    //It should be similar to receiveBookDetails function in the Books model(only difference is that you are getting all the data of reservation from the database)
    //So look into the Books model receiveBookdetials funciton for reference

    //you store the information in the database regarding books reserved.

    async reserveBook() {
        return new Promise(async (resolve, reject) => {
            //you create a function and pass in the username, and this function will return the userId of that user

        const connection = await db.getConnection();
        try {
            let userId = await this.getUserId(this.data.userName);
            //console.log(userId);
            //console.log user id and this.data.numberOfCopiesToReserve
            //console.log(userId, this.data.numberOfCopiesToReserve);

            //Start transaction
            await connection.beginTransaction();

            //Then you create a function which has to subtract from available copies of the book, the copies reserved.
            //If available copy < reserved, reject
            await this.subtractFromAvailableCopies(connection, this.data.bookId, this.data.numberOfCopiesToReserve);

            
            //After that you take in bookId, userId, number ofCopiesReserved and additional info and then you insert it into the databse.
            const reservationQuery = `Insert INTO reservations (book_id, user_id, number_of_copies) VALUES (?, ?, ?)`;
            const reservationValues = [this.data.bookId, userId, this.data.numberOfCopiesToReserve];
            await connection.query(reservationQuery, reservationValues);

            await connection.commit();
            resolve();
        } catch(e) {
            // If any error occurs, rollback the transaction to undo the subtraction
            await connection.rollback();
            console.error('Error occurred, rolling back transaction', e);
            reject("Could not reserve book");
        } 
        });
        
    }

    getUserId(userName) {
        //You can use this function to get the userId of the user who is reserving the book
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT id FROM users WHERE username = ?';
                const values = [userName];
                let [rows] = await db.query(query, values);
                //console.log(rows[0].id);
              
                resolve(rows[0].id);
            } catch(e) {
                reject(e);
            }
        });
    }

    static getUserIdWoCreatingObject(userName) {
        //You can use this function to get the userId of the user who is reserving the book
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT id FROM users WHERE username = ?';
                const values = [userName];
                let [rows] = await db.query(query, values);
                //console.log(rows[0].id);
              
                resolve(rows[0].id);
            } catch(e) {
                reject(e);
            }
        });
    }

   


    subtractFromAvailableCopies(connection, bookId, numberOfCopiesToReserve) {
        //subtracts the number of copies from available copies
        //If available copy< reserved, reject
        return new Promise(async (resolve, reject) => {
            try {
                const availableCopiesQuery = 'SELECT available_copies FROM books WHERE book_id = ?';
                const value = [bookId];
                let [rows] = await db.query(availableCopiesQuery, value);
                //console.log(rows[0].available_copies);

                if (rows[0].available_copies < numberOfCopiesToReserve) {
                    reject('Not enough copies available');
                }
                const subtractQuery = 'UPDATE books SET available_copies = available_copies - ? WHERE book_id = ?';
                const values = [numberOfCopiesToReserve, bookId];
                await connection.query(subtractQuery, values);
                resolve();
            } catch(e) {
                reject(e);
            }
            
        });
    }

    static getUserReservations(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                //const query = 'SELECT * FROM reservations WHERE user_id = ?';
                const query = 'SELECT reservation_id, books.book_id, username, number_of_copies, status, reserve_date, collect_date, collect_date_deadline, return_date, title, author FROM reservations, users, books WHERE reservations.user_id = users.id AND reservations.book_id = books.book_id AND users.id = ?';
                const values = [userId];
                let [rows] = await db.query(query, values);
                resolve(rows);
            } catch(e) {
                reject(e);
            }
        });
    }

    static async bookCollected(reservationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE reservations SET status = "Collected", collect_date = ?  WHERE reservation_id = ?';
                const values = [new Date(), reservationId];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }

    static async bookReturned(reservationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE reservations SET status = "Completed", returned_at = ?  WHERE reservation_id = ?';
                const values = [new Date(), reservationId];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }

    static async cancelReservation(reservationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'DELETE FROM reservations WHERE reservation_id = ?';
                const values = [reservationId];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }
}

module.exports = Reservation;