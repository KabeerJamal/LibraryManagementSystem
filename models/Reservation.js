const db = require('../db.js');

class Reservation{
    constructor(data) {
        this.data = data;
    }

    static async borrowerDetails() {
    try {
      const query = `SELECT 
            reservations.reservation_id,
            books.book_id,
            reservations.user_id,
            username AS borrower_name,
            number_of_copies, 
            status, 
            reserve_date, 
            collect_date,
            collect_date_deadline, 
            return_date,
            returned_at,
            title AS book_title, 
            author 
        FROM 
            reservations,
            users,
            books, 
            reservation_items 
        WHERE 
            reservations.user_id = users.id
         AND 
            reservation_items.book_id = books.book_id 
         AND 
            reservations.reservation_id = reservation_items.reservation_id`;

      // Use async/await with mysql2/promise
      const [results] = await db.query(query);
      return results;
    } catch (err) {
      throw new Error("Error retrieving reservation details: " + err);
    }
    }

    async reserveBook() {
        return new Promise(async (resolve, reject) => {
            const connection = await db.getConnection();
            try {
                //console.log(this.data);

                // Retrieve the user ID based on the provided username
                let userId = await this.getUserId(this.data.userName);

                const getUserReservationCountQuery = 'SELECT reservation_count FROM users WHERE id = ?';
                const [userRows] = await connection.query(getUserReservationCountQuery, [userId]);
                const userReservationCount = userRows[0].reservation_count;

                const query = 'SELECT value FROM settings WHERE key_name = ?';
                const [settingsRows] = await connection.query(query, ['reservation_limit_day']);
                const values = settingsRows[0].value;

                if (userReservationCount >= values) {
                    console.log('User has reached reservation limit');
                    reject('User has reached reservation limit');
                    return;
                }
                // Start the transaction
                await connection.beginTransaction();

                // Step 1: Insert a new reservation record in `reservations` table
                const reservationQuery = `INSERT INTO reservations (user_id) VALUES (?)`;
                const [reservationResult] = await connection.query(reservationQuery, [userId]);
                const reservationId = reservationResult.insertId; // Retrieve the reservation ID
                //console.log(this.data.books);
                // Step 2: For each book, check availability, subtract available copies, and insert into `reservation_items`
                for (const book of this.data.books) {
                    //console.log(book);
                    // Check and subtract available copies
                    await this.subtractFromAvailableCopies(connection, book.bookId, book.numberOfCopiesToReserve);
    
                    // Insert into `reservation_items` table
                    const reservationItemQuery = `INSERT INTO reservation_items (reservation_id, book_id, number_of_copies) VALUES (?, ?, ?)`;
                    const reservationItemValues = [reservationId, book.bookId, book.numberOfCopiesToReserve];
                    await connection.query(reservationItemQuery, reservationItemValues);
                }

                //Increment the number of reservations made by the user
                const incrementReservationsQuery = 'UPDATE users SET reservation_count = reservation_count + 1 WHERE id = ?';
                await connection.query(incrementReservationsQuery, [userId]);

                const getReservationCountQuery = 'SELECT reservation_count FROM users WHERE id = ?';
                const [rows] = await connection.query(getReservationCountQuery, [userId]);
                const updatedReservationCount = rows[0].reservation_count;

                

    
                // Commit the transaction if everything is successful
                await connection.commit();
                resolve(updatedReservationCount);
    
            } catch (error) {
                // Roll back transaction if any error occurs
                await connection.rollback();
                console.error('Error occurred, rolling back transaction', error);
                reject("Could not reserve books");
            } finally {
                connection.release();
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
                //console.log(rows[0]);
              
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
                //const query = 'SELECT reservation_id, books.book_id, username AS borrower_name, number_of_copies, status, reserve_date, collect_date, collect_date_deadline, return_date, title AS book_title, author FROM reservations, users, books WHERE reservations.user_id = users.id AND reservations.book_id = books.book_id AND users.id = ?';
                const query = 'SELECT reservations.reservation_id, books.book_id, reservations.user_id, username AS borrower_name, number_of_copies, status, reserve_date, collect_date, collect_date_deadline, return_date, returned_at, title AS book_title, author FROM reservations, users, books, reservation_items WHERE reservations.user_id = users.id AND reservation_items.book_id = books.book_id AND users.id = ? AND reservations.reservation_id = reservation_items.reservation_id';
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
                //if status was overdue and book was returned, do nothing
                const statusQuery = 'SELECT status FROM reservations WHERE reservation_id = ?';
                const [rows] = await db.query(statusQuery, [reservationId]);
                if (rows[0].status === "overdue") {
                    const overdueQuery = 'UPDATE reservations SET returned_at = ?  WHERE reservation_id = ?';
                    const value = [new Date(), reservationId];
                    await db.query(overdueQuery, value);
                    resolve('overdue');
                    return;
                }
                const query = 'UPDATE reservations SET status = "Completed", returned_at = ?  WHERE reservation_id = ?';
                const values = [new Date(), reservationId];
                await db.query(query, values);
                resolve('completed');
            } catch(e) {
                reject(e);
            }
        });
    }

    static async cancelReservation(reservationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await db.getConnection();
                try {
                    await connection.beginTransaction();

                    const getReservedBooksQuery = 'SELECT book_id, number_of_copies FROM reservation_items WHERE reservation_id = ?';
                    const [reservedBooks] = await connection.query(getReservedBooksQuery, [reservationId]);


                    for (const book of reservedBooks) {
                        try {
                            
                            await this.addIntoAvailableCopies(connection, book.book_id, book.number_of_copies);
                            
                        } catch (error) {
                            console.error("Error in addIntoAvailableCopies:", error);
                        }
                    }
                    const query = 'DELETE FROM reservations WHERE reservation_id = ?';
                    const values = [reservationId];
                    const query2 = 'DELETE FROM reservation_items WHERE reservation_id = ?';
                    await connection.query(query, values);
                    await connection.query(query2, values);

                    


                    await connection.commit();
                    resolve();
                } catch (error) {
                    await connection.rollback();
                    reject("Could not cancel reservation");
                } finally {
                    connection.release();
                }
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }


    static addIntoAvailableCopies(connection, bookId, numberOfCopiesToReserve) {
        return new Promise(async (resolve, reject) => {
            try {
                const availableCopiesQuery = 'SELECT available_copies FROM books WHERE book_id = ?';
                const value = [bookId];
                let [rows] = await db.query(availableCopiesQuery, value);
                //console.log(rows[0].available_copies);

                // if (rows[0].available_copies < numberOfCopiesToReserve) {
                //     reject('Not enough copies available');
                // }
                const addQuery = 'UPDATE books SET available_copies = available_copies + ? WHERE book_id = ?';
                const values = [numberOfCopiesToReserve, bookId];
                await connection.query(addQuery, values);
                resolve();
            } catch(e) {
                reject(e);
            }
            
        });
    }


    static badDebt(reservationId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE reservations SET status = "baddebt" WHERE reservation_id = ?';
                const values = [reservationId];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }

    static async searchReservations(searchTerm) {
        return new Promise(async (resolve,reject) => {
            try {
                //contact the database and get the reservations based on the search term
                //make a query like getUserResercvations and on that answer search for the search term
                const query = 'SELECT reservation_id, books.book_id, username, number_of_copies, status, reserve_date, collect_date, collect_date_deadline, return_date, title, author, returned_at FROM reservations, users, books WHERE reservations.user_id = users.id AND reservations.book_id = books.book_id AND (username LIKE ? OR title LIKE ?)';
                const values = [`%${searchTerm}%`, `%${searchTerm}%`];
                let [rows] = await db.query(query, values);
                resolve(rows);
            } catch(error) {
                reject(error);
            }
        })
    }

    // static async updateReservationLimit(booklimit,copylimit, reservationLimitDay) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const query = `
    //             INSERT INTO settings (key_name, value)
    //             VALUES ('book_limit', ?), ('copy_limit', ?), ('reservation_limit_day',?)
    //             ON DUPLICATE KEY UPDATE 
    //                 value = VALUES(value);
    //             `;
    //             const values = [booklimit, copylimit, reservationLimitDay];
    //             await db.query(query, values);
    //             resolve();
    //         } catch(e) {
    //             reject(e);
    //         }
    //     });
    // }


    // static async getReservationLimit() {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const query = 'SELECT * FROM settings WHERE key_name = "book_limit" OR key_name = "copy_limit" OR key_name = "reservation_limit_day"';
    //             let [rows] = await db.query(query);
    //             resolve(rows);
    //         } catch(e) {
    //             reject(e);
    //         }
    //     });
    // }

    static async findBooksGivenReservationIds(reservationIds) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(reservationIds) || reservationIds.length === 0) {
                    return resolve([]); // Return an empty array if no reservation IDs are provided
                }
    
                // Generate placeholders (?, ?, ?)
                const placeholders = reservationIds.map(() => '?').join(', ');
    
                const query = `
                    SELECT
                        ri.reservation_id,
                        b.book_id,
                        b.title,
                        b.author,
                        ri.number_of_copies
                    FROM reservation_items ri
                    JOIN books b ON ri.book_id = b.book_id
                    WHERE ri.reservation_id IN (${placeholders});
                `;
                let [rows] = await db.query(query, reservationIds);
                resolve(rows);
            } catch(e) {
                reject(e);
            }
        });
    }

}

module.exports = Reservation;